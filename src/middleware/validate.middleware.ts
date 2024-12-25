import { Request, Response, NextFunction } from "express";
import {
  body,
  param,
  validationResult,
  ValidationError,
} from "express-validator";
import Joi from "joi";
import { AppError } from "../utils/appError";

// Helper function để check validation errors
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err: ValidationError) => ({
        field: err.type === "field" ? err.path : err.type,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validation cho đăng ký
export const validateRegister = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3-30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers and underscore")
    .custom((value) => !/\s/.test(value))
    .withMessage("Username cannot contain spaces"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[A-Z])/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/^(?=.*[a-z])/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/^(?=.*\d)/)
    .withMessage("Password must contain at least one number")
    .matches(/^(?=.*[@$!%*?&])/)
    .withMessage("Password must contain at least one special character"),

  body("inviteCode")
    .notEmpty()
    .withMessage("Invite code is required")
    .isLength({ min: 8, max: 8 })
    .withMessage("Invalid invite code format"),

  handleValidationErrors,
];

// Validation cho login
export const validateLogin = [
  body("username").trim().notEmpty().withMessage("Username is required"),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

// Validation cho password reset request
export const validateResetRequest = [
  body("username").trim().notEmpty().withMessage("Username is required"),

  handleValidationErrors,
];

// Validation cho password reset
export const validatePasswordReset = [
  body("token").notEmpty().withMessage("Reset token is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[A-Z])/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/^(?=.*[a-z])/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/^(?=.*\d)/)
    .withMessage("Password must contain at least one number")
    .matches(/^(?=.*[@$!%*?&])/)
    .withMessage("Password must contain at least one special character"),

  handleValidationErrors,
];

// Validation cho user ID trong params
export const validateUserId = [
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID format"),

  handleValidationErrors,
];

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");

      return next(new AppError(errorMessage, 400));
    }

    next();
  };
};
