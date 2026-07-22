import type { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}

export function createHttpError(statusCode: number, message: string) {
  return new HttpError(statusCode, message);
}

export function assertRequiredFields(payload: Record<string, unknown>, requiredFields: string[]) {
  const missing = requiredFields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
  });

  if (missing.length > 0) {
    throw createHttpError(400, `Missing required fields: ${missing.join(', ')}`);
  }
}

export function validateEmail(value: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw createHttpError(400, 'Please provide a valid email address.');
  }
}

export function parsePositiveNumber(value: unknown, fieldName: string) {
  const parsed = typeof value === 'string' ? Number(value) : value;

  if (typeof parsed !== 'number' || !Number.isFinite(parsed) || parsed <= 0) {
    throw createHttpError(400, `${fieldName} must be a positive number.`);
  }

  return parsed;
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
