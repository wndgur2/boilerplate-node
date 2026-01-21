import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export abstract class BaseHttpController {
  /**
   * Handle async route handlers and pass errors to error middleware
   */
  protected asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Send success response
   */
  protected sendSuccess<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  protected sendError(
    res: Response,
    error: string,
    statusCode: number = 500
  ): void {
    const response: ApiResponse = {
      success: false,
      error,
    };
    res.status(statusCode).json(response);
  }
}
