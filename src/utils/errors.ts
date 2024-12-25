export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: any[]
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

// Các error codes phổ biến
export const ErrorCodes = {
  DUPLICATE_KEY: 11000,
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
