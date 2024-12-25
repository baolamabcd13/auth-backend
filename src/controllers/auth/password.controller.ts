import { Request, Response } from "express";
import User from "../../models/auth/User.model";
import { PasswordReset } from "../../models/auth/PasswordReset.model";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import logger from "../../utils/logger";

// Generate reset token
export const generateResetToken = catchAsync(
  async (req: Request, res: Response) => {
    const { username } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save hashed token to database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    logger.info(`Password reset token created for user: ${username}`);

    res.status(200).json({
      success: true,
      message: "Password reset token generated",
      token: resetToken,
    });
  }
);

// Reset password using token
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword, confirmPassword } = req.body;

  logger.info("Attempting password reset with token");

  if (newPassword !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }

  try {
    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      logger.error("Invalid or expired reset token");
      throw new AppError("Invalid or expired reset token", 400);
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info(`Password reset successful for user: ${user.username}`);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    logger.error("Password reset error:", error);
    throw new AppError("Password reset failed", 500);
  }
});

export const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check if current password matches
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      throw new AppError("Current password is incorrect", 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info(`Password changed successfully for user: ${user.username}`);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  }
);
