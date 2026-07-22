import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from '../../server/db.js';
import { adminRouter } from '../../server/routes/admin.js';
import { productsRouter } from '../../server/routes/products.js';
import { ordersRouter } from '../../server/routes/orders.js';
import { usersRouter } from '../../server/routes/users.js';
import { cartRouter } from '../../server/routes/cart.js';
import { wishlistRouter } from '../../server/routes/wishlist.js';
import { contactRouter } from '../../server/routes/contact.js';
import { eventsRouter } from '../../server/events.js';
import { notFoundHandler, errorHandler } from '../../server/middleware/errorHandler.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
}));
app.use(express.json({ limit: '16mb' }));

app.options('*', (_req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res.sendStatus(204);
});

app.use('/api/admin', adminRouter);
app.use('/admin', adminRouter);
app.use('/api/products', productsRouter);
app.use('/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/users', usersRouter);
app.use('/api/cart', cartRouter);
app.use('/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/wishlist', wishlistRouter);
app.use('/api/contact', contactRouter);
app.use('/contact', contactRouter);
app.use('/api/events', eventsRouter);
app.use('/events', eventsRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

export async function initServer() {
  await initDb();
}
