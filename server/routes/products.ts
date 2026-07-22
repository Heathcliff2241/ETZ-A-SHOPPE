import { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { put } from '@vercel/blob';
import { sql, isDbAvailable } from '../db.js';
import { requireAdmin } from './admin.js';
import { assertRequiredFields, asyncHandler, parsePositiveNumber } from '../utils/validation.js';
import { broadcast } from '../events.js';

export const productsRouter = Router();

const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');

const fallbackProducts = [
  {
    id: 'etz-p1',
    name: 'Vintage Brown Corduroy Jacket',
    price: 450,
    category: 'mens',
    size: 'L (Chest: 44", Length: 28")',
    condition: 'Like New',
    condition_note: 'Crisp collar, deep color, zero fading or fabric wear. All original brass buttons intact.',
    quantity: 1,
    images: [
      '/images/mens_vintage_jacket_1783176811459.jpg',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'A heavyweight, incredibly warm corduroy jacket in a rich chestnut brown. Perfect for cool evenings. Hand-brushed and sanitized.',
    is_sold: false,
    date_added: '2026-06-30'
  },
  {
    id: 'etz-p2',
    name: 'Cottagecore Linen Floral Dress',
    price: 490,
    category: 'womens',
    size: 'M (Bust: 36", Waist: 28-30" stretch, Length: 42")',
    condition: 'Like New',
    condition_note: 'Perfect seams, no piling or color fading. Includes the original linen belt tie.',
    quantity: 1,
    images: [
      '/images/womens_floral_dress_1783176824055.jpg',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'An elegant floral print midi dress made of durable, breathable flax linen. Fitted waist with a flowing skirt. Perfect for weekend markets or beach strolls.',
    is_sold: false,
    date_added: '2026-07-01'
  },
  {
    id: 'etz-p9',
    name: 'Handcrafted Vintage Brass & Jade Pendant Ring',
    price: 390,
    category: 'jewelry',
    size: 'Adjustable (Fits US 6-8)',
    condition: 'Like New',
    condition_note: 'Solid brass setting with natural jade stone insert. Polished surface, scratch-free stone.',
    quantity: 1,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'A striking bohemian vintage brass ring set with genuine polished green jade. Perfect statement piece with an organic, artisanal feel.',
    is_sold: false,
    date_added: '2026-07-05'
  },
  {
    id: 'etz-p10',
    name: 'Botanical Sandalwood & Bergamot Eau de Cologne (50ml)',
    price: 620,
    category: 'perfumes',
    size: '50ml (95% full bottle)',
    condition: 'Like New',
    condition_note: 'Original glass bottle & wooden cap intact. Sprayed 3-4 times only. Stored in dark, cool cabinet.',
    quantity: 1,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Warm, grounding unisex fragrance featuring top notes of zesty Italian bergamot, heart notes of cedar, and a deep base of Australian sandalwood.',
    is_sold: false,
    date_added: '2026-07-06'
  },
  {
    id: 'etz-p11',
    name: 'Artisanal Hand-Poured Soy Wax Candle & Brass Tray',
    price: 340,
    category: 'others',
    size: 'Medium (8 oz candle + 6" tray)',
    condition: 'Like New',
    condition_note: 'Brand new, unburned soy candle in amber glass jar with solid hammered brass coaster tray.',
    quantity: 1,
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Eco-friendly non-toxic soy wax candle infused with lavender and amber essential oils. Comes with a decorative vintage brass tray.',
    is_sold: false,
    date_added: '2026-07-07'
  }
];

function toProduct(row: Record<string, unknown>) {
  const imageValue = typeof row.image === 'string' && row.image ? row.image : undefined;
  let parsedImages: string[] = [];

  if (typeof imageValue === 'string' && imageValue) {
    try {
      const parsed = JSON.parse(imageValue);
      if (Array.isArray(parsed)) {
        parsedImages = parsed.filter((item): item is string => typeof item === 'string' && Boolean(item));
      } else if (typeof parsed === 'string' && parsed) {
        parsedImages = [parsed];
      }
    } catch {
      parsedImages = imageValue.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }

  const images = Array.isArray(row.images)
    ? (row.images as string[]).filter(Boolean)
    : parsedImages.length
      ? parsedImages
      : imageValue
        ? [imageValue]
        : [];
  const stock = Number(row.currentStock ?? row.quantity ?? 1);
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    price: Number(row.price ?? 0),
    category: (row.category as string) ?? 'mens',
    size: (row.size as string) ?? '',
    condition: (row.condition as string) ?? 'Gently Loved',
    conditionNote: (row.condition_note as string) ?? (row.conditionNote as string) ?? '',
    quantity: Number.isFinite(stock) && stock > 0 ? stock : 1,
    images,
    description: String(row.description ?? ''),
    isSold: Boolean(row.is_sold !== undefined ? row.is_sold : (row.isSold !== undefined ? row.isSold : (Number(row.currentStock ?? 1) <= 0))),
    dateAdded: String(row.date_added ?? row.createdAt ?? row.dateAdded ?? ''),
    soldAt: row.sold_at ? String(row.sold_at) : (row.soldAt ? String(row.soldAt) : undefined),
  };
}

async function getProductsFromDb() {
  if (!isDbAvailable() || !sql) {
    return fallbackProducts.map(toProduct);
  }

  try {
    const rows = await sql.query(
      'SELECT id, name, description, price, category, size, condition, condition_note, quantity, images, is_sold, sold_at, date_added FROM etz_products ORDER BY date_added DESC'
    ) as Array<Record<string, unknown>>;
    return rows.map(toProduct);
  } catch (error) {
    console.warn('[products] Falling back to demo products because the database schema does not match the expected shape.', error);
    return fallbackProducts.map(toProduct);
  }
}

productsRouter.post('/upload', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;
  const filename = typeof body.filename === 'string' ? body.filename : '';
  const data = typeof body.data === 'string' ? body.data : '';

  if (!filename || !data) {
    return res.status(400).json({ error: 'An image file is required.' });
  }

  const match = data.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    return res.status(400).json({ error: 'Invalid image payload.' });
  }

  const [, mimeType, base64Data] = match;
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const ext = path.extname(safeName) || (mimeType.includes('png') ? '.png' : mimeType.includes('jpeg') ? '.jpg' : '.jpg');
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const fileBuffer = Buffer.from(base64Data, 'base64');

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(uniqueName, fileBuffer, {
      access: 'public',
      contentType: mimeType,
    });
    return res.json({ url: blob.url });
  }

  try {
    const filePath = path.join(uploadDir, uniqueName);
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, fileBuffer);
    return res.json({ url: `/images/uploads/${uniqueName}` });
  } catch (err) {
    console.warn('[upload] Local disk is read-only or inaccessible (e.g. Vercel Serverless), falling back to returning base64 data URI directly.', err);
    return res.json({ url: data });
  }
}));

// ── GET /api/products  (public) ───────────────────────────────────────────────
productsRouter.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const products = await getProductsFromDb();
  return res.json(products);
}));

// ── GET /api/products/:id  (public) ──────────────────────────────────────────
productsRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  if (!isDbAvailable() || !sql) {
    const match = fallbackProducts.find((product) => product.id === req.params.id);
    if (!match) return res.status(404).json({ error: 'Not found.' });
    return res.json(toProduct(match));
  }

  try {
    const rows = await sql.query(
      'SELECT id, name, description, price, category, size, condition, condition_note, quantity, images, is_sold, sold_at, date_added FROM etz_products WHERE id = $1',
      [req.params.id]
    ) as Array<Record<string, unknown>>;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found.' });
    return res.json(toProduct(rows[0]));
  } catch (error) {
    console.warn('[products] Could not read product from DB, returning fallback result.', error);
    const match = fallbackProducts.find((product) => product.id === req.params.id);
    if (!match) return res.status(404).json({ error: 'Not found.' });
    return res.json(toProduct(match));
  }
}));

// ── POST /api/products  (admin) ───────────────────────────────────────────────
productsRouter.post('/', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const p = req.body as Record<string, unknown>;
  assertRequiredFields(p, ['name', 'price', 'category', 'size', 'condition']);

  if (!isDbAvailable() || !sql) {
    return res.status(503).json({ error: 'Product storage is currently unavailable.' });
  }

  const now = new Date().toISOString();
  const price = parsePositiveNumber(p.price, 'price');
  const quantity = typeof p.quantity === 'number' ? p.quantity : 1;
  const imageUrls = Array.isArray(p.images)
    ? p.images.filter((item): item is string => typeof item === 'string' && Boolean(item))
    : [];
  const imageValue = imageUrls.length > 0 ? JSON.stringify(imageUrls) : '';
  const description = [
    String(p.description ?? ''),
    p.conditionNote ? `Condition note: ${String(p.conditionNote)}` : '',
    p.size ? `Size: ${String(p.size)}` : '',
    p.condition ? `Condition: ${String(p.condition)}` : '',
  ].filter(Boolean).join('\n');

  try {
    const id = 'etz-p-' + Math.random().toString(36).slice(2, 11);
    const rows = await sql.query(
      `
        INSERT INTO etz_products
          (id, name, price, category, size, condition, condition_note, quantity, images, description, is_sold, sold_at, date_added)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id, name, price, category, size, condition, condition_note, quantity, images, description, is_sold, sold_at, date_added
      `,
      [
        id,
        String(p.name),
        price,
        String(p.category),
        String(p.size),
        String(p.condition),
        String(p.conditionNote || ''),
        quantity,
        imageUrls,
        String(p.description || ''),
        false,
        null,
        now
      ]
    ) as Array<Record<string, unknown>>;
    const createdProduct = toProduct(rows[0]);
    try { broadcast('product:updated', createdProduct); } catch {}
    return res.status(201).json(createdProduct);
  } catch (error) {
    console.warn('[products] Failed to insert product.', error);
    return res.status(503).json({ error: 'Product storage is currently unavailable.' });
  }
}));

// ── PUT /api/products/:id  (admin) ────────────────────────────────────────────
productsRouter.put('/:id', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const p = req.body as Record<string, unknown>;
  const price = p.price !== undefined ? parsePositiveNumber(p.price, 'price') : undefined;
  const quantity = p.quantity !== undefined ? Number(p.quantity) : undefined;

  if (!isDbAvailable() || !sql) {
    return res.status(503).json({ error: 'Product storage is currently unavailable.' });
  }

  try {
    const imageUrls = Array.isArray(p.images)
      ? p.images.filter((item): item is string => typeof item === 'string' && Boolean(item))
      : undefined;

    const rows = await sql.query(
      `
        UPDATE etz_products SET
          name = CASE WHEN $1::text IS NOT NULL THEN $1::text ELSE name END,
          price = CASE WHEN $2::numeric IS NOT NULL THEN $2::numeric ELSE price END,
          category = CASE WHEN $3::text IS NOT NULL THEN $3::text ELSE category END,
          size = CASE WHEN $4::text IS NOT NULL THEN $4::text ELSE size END,
          condition = CASE WHEN $5::text IS NOT NULL THEN $5::text ELSE condition END,
          condition_note = CASE WHEN $6::text IS NOT NULL THEN $6::text ELSE condition_note END,
          quantity = CASE WHEN $7::integer IS NOT NULL THEN $7::integer ELSE quantity END,
          images = CASE WHEN $8::text[] IS NOT NULL THEN $8::text[] ELSE images END,
          description = CASE WHEN $9::text IS NOT NULL THEN $9::text ELSE description END,
          is_sold = CASE WHEN $10::boolean IS NOT NULL THEN $10::boolean ELSE is_sold END,
          sold_at = CASE 
            WHEN $10::boolean = TRUE THEN COALESCE(sold_at, $12::text)
            WHEN $10::boolean = FALSE THEN NULL
            ELSE sold_at
          END
        WHERE id = $11
        RETURNING id, name, price, category, size, condition, condition_note, quantity, images, description, is_sold, sold_at, date_added
      `,
      [
        p.name !== undefined ? String(p.name) : null,
        price !== undefined ? price : null,
        p.category !== undefined ? String(p.category) : null,
        p.size !== undefined ? String(p.size) : null,
        p.condition !== undefined ? String(p.condition) : null,
        p.conditionNote !== undefined ? String(p.conditionNote) : null,
        quantity !== undefined ? quantity : null,
        imageUrls !== undefined ? imageUrls : null,
        p.description !== undefined ? String(p.description) : null,
        p.isSold !== undefined ? Boolean(p.isSold) : null,
        req.params.id,
        new Date().toISOString()
      ]
    ) as Array<Record<string, unknown>>;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found.' });
    const updatedProduct = toProduct(rows[0]);
    try { broadcast('product:updated', updatedProduct); } catch {}
    return res.json(updatedProduct);
  } catch (error) {
    console.warn('[products] Failed to update product.', error);
    return res.status(503).json({ error: 'Product storage is currently unavailable.' });
  }
}));

// ── DELETE /api/products/:id  (admin) ─────────────────────────────────────────
productsRouter.delete('/:id', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  if (!isDbAvailable() || !sql) {
    return res.status(503).json({ error: 'Product storage is currently unavailable.' });
  }

  try {
    const id = req.params.id;
    // Delete any cart or wishlist items pointing to this product to satisfy FK constraints
    await sql.query('DELETE FROM etz_carts WHERE product_id = $1', [id]);
    await sql.query('DELETE FROM etz_wishlists WHERE product_id = $1', [id]);
    await sql.query('DELETE FROM etz_products WHERE id = $1', [id]);
    try { broadcast('product:updated', { deletedId: id }); } catch {}
    return res.json({ ok: true });
  } catch (error) {
    console.warn('[products] Failed to delete product.', error);
    return res.status(503).json({ error: 'Product storage is currently unavailable.' });
  }
}));
