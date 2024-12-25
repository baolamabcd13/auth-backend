import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

type AsyncFunction = (
  req: Request | AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = (fn: AsyncFunction): RequestHandler => {
  return (req: Request | AuthRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
