import { z } from "zod";

const datetime = z.iso.datetime();

export const createTaskSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(2000).optional(),
  project: z.string().length(24),
  assignedTo: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .nullable()
    .optional(),
  tags: z.array(z.string().min(1).max(10)).optional(),
  dueDate: z.string().pipe(z.iso.datetime()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().min(1).max(2000).optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  assignedTo: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .nullable()
    .optional(),
  tags: z.array(z.string().min(1).max(10)).optional(),
  dueDate: z.string().pipe(z.iso.datetime()).optional(),
});
