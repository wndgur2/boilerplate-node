import { Request, Response } from 'express';
import { Socket } from 'socket.io';

// HTTP Request/Response types
export interface HttpRequest extends Request {
  userId?: number;
}

export interface HttpResponse extends Response {}

// Socket types
export interface SocketClient extends Socket {
  userId?: number;
}

// Database types
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface QueryResult<T = any> {
  rows: T[];
  affectedRows?: number;
}

// Common entity types
export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  username: string;
  email: string;
  password: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error types
export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}
