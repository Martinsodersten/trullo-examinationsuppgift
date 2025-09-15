import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User";

export type TaskStatus = "to-do" | "in_progress" | "blocked" | "done";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  project: Types.ObjectId;
  createdBy: Types.ObjectId;
  assignedTo?: Types.ObjectId | null;
  tags?: string[];
  dueDate?: Date | null;

  finishedAt?: Date | null;
  finishedBy?: Types.ObjectId | null;
}

const TaskSchema: Schema<ITask> = new Schema<ITask>({
  title: { type: String, required: true, trim: true, maxLength: 120 },
  description: { type: String, required: true, maxLength: 2000 },
  status: {
    type: String,
    enum: ["to-do", "in_progress", "blocked", "done"],
    default: "to-do",
    index: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true,
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tags: [
    { type: [String], default: [], validate: (v: string[]) => v.length <= 10 },
  ],
  dueDate: { type: Date, default: null },
  finishedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
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
