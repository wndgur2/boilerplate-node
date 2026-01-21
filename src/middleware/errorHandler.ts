import { Request, Response } from 'express';
import { AppError } from '../types';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};

export const notFoundHandler = (
  _req: Request,
  res: Response
): void => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
};
