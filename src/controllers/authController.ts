import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
const JWT_EXPIRES_IN = "1h";

// Register a new user
export const register = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const user = await User.create({ email, name, password });
  res.status(201).json({ message: "User registered successfully" });
};

// Login user and return JWT
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  res.status(200).json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
};
