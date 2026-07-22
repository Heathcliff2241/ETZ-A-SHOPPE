import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import next from 'next';
import { initDb } from './db.js';
import { adminRouter } from './routes/admin.js';
import { productsRouter } from './routes/products.js';
import { ordersRouter } from './routes/orders.js';
import { usersRouter } from './routes/users.js';
import { cartRouter } from './routes/cart.js';
import { wishlistRouter } from './routes/wishlist.js';
import { contactRouter } from './routes/contact.js';
import { eventsRouter } from './events.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const PORT = 3000;

async function startServer() {
  console.log(`[server] Initializing Next.js SSR app (dev=${dev})...`);
  const nextApp = next({ dev, dir: process.cwd() });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  const app = express();

  app.use(cors({ origin: true, credentials: true, methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'] }));
  app.use(express.json({ limit: '16mb' }));

  // Serve SEO/AI static files from public/ (robots, sitemap, llms)
  app.use(express.static(path.join(process.cwd(), 'public'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('robots.txt')) res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      if (filePath.endsWith('sitemap.xml')) res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      if (filePath.endsWith('llms.txt')) res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    }
  }));
  app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));

  app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(204);
  });

  // API Routes
  app.use('/api/admin', adminRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/wishlist', wishlistRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/events', eventsRouter);

  // Health check
  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  // Unmatched API routes throw 404 JSON
  app.use('/api/*', notFoundHandler);
  app.use(errorHandler);

  // Next.js handles all page & SSR requests
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start DB and listen
  try {
    await initDb();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[server] ETZ Shop Next.js SSR app running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[server] Failed to initialize DB or server startup:', err);
    process.exit(1);
  }
}

startServer();

