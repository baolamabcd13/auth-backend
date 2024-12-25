import rateLimit from "express-rate-limit";
import helmet from "helmet";

// Rate limiting
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Security headers
export const securityHeaders = helmet();
