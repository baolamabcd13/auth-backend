import Joi from "joi";

export const registerValidation = Joi.object({
  username: Joi.string().required().min(3).max(30).messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 30 characters",
  }),

  password: Joi.string()
    .required()
    .min(6)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    }),

  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm password is required",
  }),

  inviteCode: Joi.string().optional().messages({
    "string.empty": "Invite code cannot be empty if provided",
  }),
});

export const loginValidation = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export const resetRequestValidation = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required",
  }),
});

export const passwordResetValidation = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Reset token is required",
  }),

  newPassword: Joi.string()
    .required()
    .min(6)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 6 characters long",
      "string.pattern.base":
        "New password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    }),

  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .messages({
      "any.only": "Passwords do not match",
      "string.empty": "Confirm password is required",
    }),
});

// ... rest of your validation schemas ...
