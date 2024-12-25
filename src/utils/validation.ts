import mongoose from "mongoose";
import * as yup from "yup";
import { User } from "../models/auth/User.model";

// Validation helpers
export const validateObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const validateUsername = (username: string): boolean => {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username);
};

export const validatePassword = (password: string): boolean => {
  // Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
};

// Helper function để kiểm tra có phải first user không
const isFirstUser = async () => {
  return (await User.countDocuments()) === 0;
};

// Validation schemas
export const loginSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .test("valid-username", "Invalid username format", validateUsername),
  password: yup.string().required("Password is required"),
});

export const registerSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  inviteCode: yup
    .string()
    .test("invite-code", "Invite code is required", async function (value) {
      // Nếu là user đầu tiên, không cần invite code
      if (await isFirstUser()) {
        return true;
      }
      // Những user sau bắt buộc phải có invite code
      return typeof value === "string" && value.length > 0;
    }),
});

export const resetPasswordSchema = yup.object({
  resetCode: yup
    .string()
    .required("Reset code is required")
    .length(8, "Reset code must be 8 characters"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .test(
      "valid-password",
      "Password must contain uppercase, lowercase and numbers",
      validatePassword
    ),
});

export const createResetCodeSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .test("valid-username", "Invalid username format", validateUsername),
});
