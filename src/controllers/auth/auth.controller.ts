import { Request, Response } from "express";
import User from "../../models/auth/User.model";
import InviteCode from "../../models/auth/InviteCode.model";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import { generateToken } from "../../utils/generateToken";
import logger from "../../utils/logger";
import { BlacklistedToken } from "../../models/auth/BlacklistedToken.model";
import mongoose from "mongoose";
import TokenBlacklist from "../../models/auth/TokenBlacklist.model";

export const register = catchAsync(async (req: Request, res: Response) => {
  try {
    const { username, password, confirmPassword, inviteCode } = req.body;

    console.log("=== REGISTER DEBUG ===");
    console.log("1. Request received:", {
      username,
      hasPassword: !!password,
      hasInviteCode: !!inviteCode,
    });

    // Basic validation
    if (!username || !password) {
      throw new AppError("Username and password are required", 400);
    }

    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new AppError("Username already exists", 400);
    }

    // Check if first user
    let isFirstUser = false;
    try {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      const usersCollectionExists = collections.some(
        (col) => col.name === "users"
      );

      if (!usersCollectionExists) {
        console.log("2. Users collection does not exist - this is first user");
        isFirstUser = true;
      } else {
        const count = await User.countDocuments();
        console.log("2. Current user count:", count);
        isFirstUser = count === 0;
      }
    } catch (error) {
      console.error("Error checking users:", error);
      isFirstUser = false;
    }

    console.log("3. Is first user?", isFirstUser);

    // Validate invite code for non-first users
    if (!isFirstUser) {
      if (!inviteCode) {
        throw new AppError("Invite code is required for non-admin users", 400);
      }

      // Validate invite code
      const validInviteCode = await InviteCode.findOne({
        code: inviteCode,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      });

      if (!validInviteCode) {
        throw new AppError("Invalid or expired invite code", 400);
      }

      // Mark invite code as used
      validInviteCode.isUsed = true;
      await validInviteCode.save();
    }

    // Create user
    const user = await User.create({
      username,
      password,
      role: isFirstUser ? "admin" : "editor",
    });

    console.log("4. User created:", {
      id: user._id,
      username: user.username,
      role: user.role,
    });

    const token = generateToken(user._id);

    console.log("=== REGISTER END ===");

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    logger.info(`User logged in successfully: ${username}`);
    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    throw new AppError("Invalid username or password", 401);
  }
});

export const generateInviteCode = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== "admin") {
      throw new AppError("Not authorized to generate invite codes", 403);
    }

    const inviteCode = await InviteCode.create({
      code: Math.random().toString(36).substring(2, 10).toUpperCase(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      isUsed: false,
    });

    logger.info(`New invite code generated: ${inviteCode.code}`);

    res.status(201).json({
      success: true,
      data: {
        code: inviteCode.code,
        expiresAt: inviteCode.expiresAt,
      },
    });
  }
);

export const logout = catchAsync(async (req: Request, res: Response) => {
  try {
    // Lấy token từ header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("No token found", 401);
    }

    // Thêm token vào blacklist
    await TokenBlacklist.create({ token });

    logger.info(`User logged out successfully`);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error("Logout error:", error);
    throw new AppError("Logout failed", 500);
  }
});
