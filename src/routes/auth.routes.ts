import express from "express";
import {
  register,
  login,
  logout,
  generateInviteCode,
} from "../controllers/auth/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { protect, admin } from "../middleware/auth.middleware";
import {
  generateResetToken,
  resetPassword,
} from "../controllers/auth/password.controller";
import {
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
} from "../middleware/rateLimiter.middleware";
import {
  loginValidation,
  registerValidation,
  resetRequestValidation,
  passwordResetValidation,
} from "../validations/auth.validation";

const router = express.Router();

// Auth routes
router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/logout", protect, logout);

// Password reset routes
router.post("/reset-token", generateResetToken);
router.post("/reset", validate(passwordResetValidation), resetPassword);

// Protected routes
router.get("/generate-invite", protect, admin, generateInviteCode);

export default router;
