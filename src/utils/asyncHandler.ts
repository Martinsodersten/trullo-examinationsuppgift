import { Request, Response, NextFunction } from "express";

// Async wrapper to catch errors in async route handlers and pass them to the error handler middleware
export const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
