import mongoose, { Schema, Types, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  description?: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true, maxLength: 100 },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    description: { type: String, maxLength: 500, default: "" },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
