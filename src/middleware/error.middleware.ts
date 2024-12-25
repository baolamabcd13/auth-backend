import { Request, Response, NextFunction } from "express";
import { AppError } from "../../src/utils/appError";
import logger from "../../src/utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error({
      message: err.message,
      stack: err.stack,
      path: req.path,
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Log unknown errors
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
  });

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
