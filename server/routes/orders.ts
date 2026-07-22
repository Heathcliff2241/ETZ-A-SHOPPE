import { Router, Request, Response } from 'express';
import { sql } from '../db.js';
import { requireAdmin } from './admin.js';
import { assertRequiredFields, asyncHandler, validateEmail } from '../utils/validation.js';
import { sendOrderNotification } from '../mailer.js';
import { broadcast } from '../events.js';

export const ordersRouter = Router();

function toOrder(row: Record<string, unknown>) {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    deliveryMethod: row.delivery_method,
    deliveryAddress: row.delivery_address,
    contactMethod: row.contact_method,
    note: row.note,
    items: row.items,
    subtotal: Number(row.subtotal),
    status: row.status,
    paymentMethod: row.payment_method || 'cash',
    paymentStatus: row.payment_status || 'unpaid',
    dateCreated: row.date_created,
  };
}

// ── GET /api/orders/lookup (public — customer order tracking) ──────────────────────────
ordersRouter.get('/lookup', asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.query ? String(req.query.query).trim() : '';
  if (!query) {
    return res.status(400).json({ error: 'Please enter an email or phone number to look up your orders.' });
  }

  // Find orders matching either customer_email or customer_phone
  const rows = await sql`
    SELECT * FROM etz_orders 
    WHERE LOWER(customer_email) = LOWER(${query}) 
       OR customer_phone = ${query}
       OR REPLACE(customer_phone, ' ', '') = REPLACE(${query}, ' ', '')
    ORDER BY date_created DESC
  ` as Array<Record<string, unknown>>;

  return res.json(rows.map(toOrder));
}));

// ── POST /api/orders  (public — place order) ─────────────────────────────────
ordersRouter.post('/', asyncHandler(async (req: Request, res: Response) => {
  const o = req.body as Record<string, unknown>;
  assertRequiredFields(o, ['customerName', 'customerPhone', 'customerEmail', 'deliveryMethod', 'items', 'subtotal']);
  validateEmail(String(o.customerEmail));

  const id = `ETZ-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateCreated = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' });
  const items = Array.isArray(o.items) ? o.items : [];

  const paymentMethod = (o.paymentMethod === 'gcash' || o.paymentMethod === 'cash') ? String(o.paymentMethod) : 'cash';
  // GCash orders start as 'gcash_pending', cash orders as 'unpaid' (payment on delivery)
  const paymentStatus = paymentMethod === 'gcash' ? 'gcash_pending' : 'unpaid';

  // ── Concurrency & Double-Order Check ──────────────────────────────────────────
  const requestedProductIds = (items as Array<{ productId?: string }>)
    .map(i => i.productId)
    .filter((pid): pid is string => Boolean(pid));

  if (requestedProductIds.length > 0) {
    const alreadySold = await sql`
      SELECT id, name FROM etz_products 
      WHERE id = ANY(${requestedProductIds}) AND is_sold = true
    ` as Array<{ id: string; name: string }>;

    if (alreadySold.length > 0) {
      const soldNames = alreadySold.map(p => `"${p.name}"`).join(', ');
      return res.status(409).json({ 
        error: `Sorry, ${soldNames} was just reserved or purchased by another customer! Please remove it from your cart.` 
      });
    }
  }

  await sql`
    INSERT INTO etz_orders
      (id, customer_name, customer_phone, customer_email, delivery_method,
       delivery_address, contact_method, note, items, subtotal, status,
       payment_method, payment_status, date_created)
    VALUES
      (${id}, ${String(o.customerName)}, ${String(o.customerPhone)}, ${String(o.customerEmail)},
       ${String(o.deliveryMethod)}, ${o.deliveryAddress ? String(o.deliveryAddress) : null}, ${o.contactMethod ? String(o.contactMethod) : null},
       ${o.note ? String(o.note) : null}, ${JSON.stringify(items)}, ${Number(o.subtotal)},
       'pending', ${paymentMethod}, ${paymentStatus}, ${dateCreated})
  `;

  const now = new Date().toISOString();
  if (requestedProductIds.length > 0) {
    await sql`UPDATE etz_products SET is_sold = true, sold_at = ${now} WHERE id = ANY(${requestedProductIds})`;
  }

  const rows = await sql`SELECT * FROM etz_orders WHERE id = ${id}`;
  const order = rows[0] as Record<string, unknown>;

  try {
    await sendOrderNotification({
      id,
      customerName: String(o.customerName),
      customerEmail: String(o.customerEmail),
      status: 'pending',
      subtotal: Number(o.subtotal),
      paymentMethod: paymentMethod as 'gcash' | 'cash',
      items: Array.isArray(items) ? items.map((item) => ({ productName: typeof item.productName === 'string' ? item.productName : undefined, productId: typeof item.productId === 'string' ? item.productId : undefined })) : [],
    }, true);
  } catch (error) {
    console.warn('[orders] Failed to send order notification.', error);
  }

  const createdOrder = toOrder(order);
  try {
    broadcast('order:created', createdOrder);
    if (requestedProductIds.length > 0) {
      broadcast('product:updated', { soldProductIds: requestedProductIds });
    }
  } catch (err) {
    console.warn('[orders] Failed to broadcast order event:', err);
  }

  return res.status(201).json(createdOrder);
}));

// ── GET /api/orders  (admin only) ────────────────────────────────────────────
ordersRouter.get('/', requireAdmin, asyncHandler(async (_req: Request, res: Response) => {
  const rows = await sql`SELECT * FROM etz_orders ORDER BY date_created DESC` as Array<Record<string, unknown>>;
  return res.json(rows.map(toOrder));
}));

// ── PUT /api/orders/:id/status  (admin only) ──────────────────────────────────
ordersRouter.put('/:id/status', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as { status?: string };
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'picked_up', 'cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  await sql`UPDATE etz_orders SET status = ${status} WHERE id = ${req.params.id}`;

  if (status === 'cancelled') {
    const rows = await sql`SELECT items FROM etz_orders WHERE id = ${req.params.id}` as Array<Record<string, unknown>>;
    if (rows.length > 0) {
      const items = rows[0].items as { productId?: string }[];
      for (const item of items) {
        if (item.productId) {
          await sql`UPDATE etz_products SET is_sold = false, sold_at = NULL WHERE id = ${item.productId}`;
        }
      }
    }
  }

  const rows2 = await sql`SELECT * FROM etz_orders WHERE id = ${req.params.id}` as Array<Record<string, unknown>>;
  if (rows2.length === 0) return res.status(404).json({ error: 'Not found.' });

  try {
    const order = rows2[0] as Record<string, unknown>;
    await sendOrderNotification({
      id: String(order.id),
      customerName: String(order.customer_name || ''),
      customerEmail: String(order.customer_email || ''),
      status,
      subtotal: Number(order.subtotal || 0),
      paymentMethod: (String(order.payment_method || 'cash')) as 'gcash' | 'cash',
      items: Array.isArray(order.items) ? order.items as Array<{ productName?: string; productId?: string }> : [],
    }, false);
  } catch (error) {
    console.warn('[orders] Failed to send order status notification.', error);
  }

  const updatedOrder = toOrder(rows2[0]);
  try { broadcast('order:updated', updatedOrder); } catch {}
  return res.json(updatedOrder);
}));

// ── PUT /api/orders/:id/payment-status  (admin only) ─────────────────────────
ordersRouter.put('/:id/payment-status', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { paymentStatus } = req.body as { paymentStatus?: string };
  const validPaymentStatuses = ['unpaid', 'gcash_pending', 'paid', 'refunded'];

  if (!paymentStatus || !validPaymentStatuses.includes(paymentStatus)) {
    return res.status(400).json({ error: 'Invalid payment status.' });
  }

  await sql`UPDATE etz_orders SET payment_status = ${paymentStatus} WHERE id = ${req.params.id}`;

  const rows = await sql`SELECT * FROM etz_orders WHERE id = ${req.params.id}` as Array<Record<string, unknown>>;
  if (rows.length === 0) return res.status(404).json({ error: 'Not found.' });

  const updatedOrder = toOrder(rows[0]);
  try { broadcast('order:updated', updatedOrder); } catch {}
  return res.json(updatedOrder);
}));
