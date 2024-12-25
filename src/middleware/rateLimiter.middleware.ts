import rateLimit from "express-rate-limit";
import { AppError } from "../utils/appError";

// Giới hạn chung cho tất cả API
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn mỗi IP: 100 requests mỗi 15 phút
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Giới hạn cho login API
export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5, // 5 lần thử login sai
  message: {
    success: false,
    message:
      "Too many login attempts from this IP, please try again after an hour",
  },
  skipSuccessfulRequests: true, // Không tính các lần login thành công
});

// Giới hạn cho register API
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 3, // 3 lần đăng ký mỗi giờ
  message: {
    success: false,
    message:
      "Too many registration attempts from this IP, please try again after an hour",
  },
});

// Giới hạn cho password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 10, // 3 lần reset mỗi giờ
  message: {
    success: false,
    message:
      "Too many password reset attempts from this IP, please try again after an hour",
  },
});
