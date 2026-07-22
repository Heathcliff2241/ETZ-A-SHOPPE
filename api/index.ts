import { Request, Response } from 'express';
import app, { initServer } from './_lib/server.js';

let initPromise: Promise<void> | null = null;

export default async function handler(req: Request, res: Response) {
  if (!initPromise) {
    initPromise = initServer().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  await initPromise;
  return app(req, res);
}
