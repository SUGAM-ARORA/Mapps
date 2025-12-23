import { Request, Response, NextFunction } from 'express';

/**
 * Custom API error with consistent format.
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Global error handler middleware.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error('[Error]', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  if (err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}

/**
 * Async route handler wrapper to catch errors.
 */
export function catchAsync(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
