import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";

export type TaskStatus = "to-do" | "in progress" | "blocked" | "done";

export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo?: IUser["_id"] | null;
  createdAt: Date;
  finishedAt?: Date | null;
}

const TaskSchema: Schema<ITask> = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["to-do", "in progress", "blocked", "done"],
    default: "to-do",
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now },
  finishedAt: { type: Date, default: null },
});

// Middleware to set finishedAt status to done
TaskSchema.pre<ITask>("save", function (next) {
  if (this.isModified("status") && this.status === "done") {
    this.finishedAt = new Date();
  }
  next();
});

export const Task: Model<ITask> = mongoose.model<ITask>("Task", TaskSchema);
