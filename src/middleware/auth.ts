import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: "user" | "admin" };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };
    req.user = { id: payload.id, role: payload.role as "user" | "admin" };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRole = (role: Array<"user" | "admin">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (!role.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
