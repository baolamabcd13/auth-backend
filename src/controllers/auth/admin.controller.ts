import { Request, Response } from "express";
import User from "../../models/auth/User.model";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import logger from "../../config/logger";
import InviteCode from "../../models/auth/InviteCode.model";

// Admin controllers
export const adminDashboard = catchAsync(
  async (req: Request, res: Response) => {
    try {
      // Ensure user exists and is admin
      if (!req.user || req.user.role !== "admin") {
        throw new AppError("Not authorized", 403);
      }

      // Your admin dashboard logic here
      res.json({
        success: true,
        data: {
          message: "Welcome to admin dashboard",
          user: {
            username: req.user.username,
            role: req.user.role,
          },
        },
      });
    } catch (error) {
      logger.error("Admin dashboard error:", error);
      throw new AppError(
        error instanceof Error ? error.message : "Admin dashboard failed",
        500
      );
    }
  }
);

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    data: users,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    // Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Không cho phép xóa chính mình
    if (user._id.toString() === req.user?._id.toString()) {
      throw new AppError("Cannot delete yourself", 400);
    }

    // Xóa user
    await User.findByIdAndDelete(userId);

    logger.info(`User deleted successfully: ${userId}`);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    logger.error("Delete user error:", error);
    throw new AppError(
      error instanceof Error ? error.message : "Failed to delete user",
      500
    );
  }
});

// Lấy danh sách tất cả invite codes
export const getInviteCodes = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const inviteCodes = await InviteCode.find().sort({ createdAt: -1 });

      res.json({
        success: true,
        data: inviteCodes,
      });
    } catch (error) {
      logger.error("Get invite codes error:", error);
      throw new AppError("Failed to get invite codes", 500);
    }
  }
);

// Vô hiệu hóa một invite code
export const invalidateInviteCode = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const inviteCode = await InviteCode.findById(id);
      if (!inviteCode) {
        throw new AppError("Invite code not found", 404);
      }

      // Đánh dấu là đã sử dụng
      inviteCode.isUsed = true;
      await inviteCode.save();

      res.json({
        success: true,
        message: "Invite code invalidated successfully",
      });
    } catch (error) {
      logger.error("Invalidate invite code error:", error);
      throw new AppError("Failed to invalidate invite code", 500);
    }
  }
);

// Xem thống kê invite codes
export const getInviteCodeStats = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const total = await InviteCode.countDocuments();
      const used = await InviteCode.countDocuments({ isUsed: true });
      const expired = await InviteCode.countDocuments({
        expiresAt: { $lt: new Date() },
      });
      const active = await InviteCode.countDocuments({
        isUsed: false,
        expiresAt: { $gt: new Date() },
      });

      res.json({
        success: true,
        data: {
          total,
          used,
          expired,
          active,
        },
      });
    } catch (error) {
      logger.error("Get invite code stats error:", error);
      throw new AppError("Failed to get invite code statistics", 500);
    }
  }
);

// Update user role
export const updateUserRole = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user._id.toString()) {
      throw new AppError("Admin cannot change their own role", 400);
    }

    user.role = role;
    await user.save();
    logger.info(`Role updated for user ${user.username} to ${role}`);

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);
