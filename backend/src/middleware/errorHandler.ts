// Global error handler middleware
// Catches all errors thrown in controllers/services and sends clean JSON response

import { Request, Response, NextFunction } from 'express';

// Custom error class with status code
export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

// The middleware function that Express calls when an error is thrown
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  // If it's our custom AppError, use its status code
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // For unexpected errors, log and send 500
  console.error('❌ Unexpected error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
