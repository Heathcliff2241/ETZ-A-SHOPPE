import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/validation.js';

export function notFoundHandler(_req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ error: 'Route not found.' });
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error('[server] Unhandled error:', err);

  return res.status(500).json({ error: 'Internal server error.' });
};
