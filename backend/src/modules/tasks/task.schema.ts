import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    dueDate: z.string().datetime().optional().nullable(),
    assignedToId: z.string().cuid().optional().nullable(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional().nullable(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    dueDate: z.string().datetime().optional().nullable(),
    assignedToId: z.string().cuid().optional().nullable(),
  }),
});

export const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  }),
});
