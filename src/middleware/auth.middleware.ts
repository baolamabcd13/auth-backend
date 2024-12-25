import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/auth/User.model";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import logger from "../config/logger";
import TokenBlacklist from "../models/auth/TokenBlacklist.model";

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from header
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new AppError("Not authorized to access this route", 401);
      }

      // Check if token is blacklisted
      const isBlacklisted = await TokenBlacklist.findOne({ token });
      if (isBlacklisted) {
        throw new AppError("Token is no longer valid", 401);
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      // Get user from token
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        throw new AppError("User not found", 404);
      }

      req.user = user;
      next();
    } catch (error) {
      logger.error("Auth middleware error:", error);
      throw new AppError("Not authorized to access this route", 401);
    }
  }
);

export const admin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError("User not found", 401);
    }

    if (req.user.role !== "admin") {
      throw new AppError("Not authorized as admin", 403);
    }

    next();
  } catch (error) {
    logger.error("Admin middleware error:", error);
    next(error);
  }
};
