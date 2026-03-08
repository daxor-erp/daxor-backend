/**
 * Custom Application Error
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly errors?: any;
  public readonly isOperational: boolean;

  constructor(
    message: string, 
    statusCode: number = 500, 
    code?: string, 
    errors?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || `ERR_${statusCode}`;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;