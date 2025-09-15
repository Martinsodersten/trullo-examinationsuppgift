import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export type UserRole = "admin" | "user";

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    password: { type: String, required: true, minLength: 8, select: false },
    passwordResetToken: { type: String, default: null, select: false } as any,
    passwordResetExpires: { type: Date, default: null, select: false },
  },
  { timestamps: true }
);

// Hash password automatically before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hash password automatically before updating
UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Record<string, any>;
  if (update && update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
