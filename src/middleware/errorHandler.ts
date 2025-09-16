import { Request, Response, NextFunction } from "express";
import { de } from "zod/v4/locales";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: "Not Found" });
}
// Error handling middleware
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ message: "DB validation error", details: err.errors });
  }
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
}
