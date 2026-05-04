import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Project name must be at least 2 characters"),
    description: z.string().optional(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color")
      .default("#6ee7b7"),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
  }),
});

export const addMemberSchema = z.object({
  body: z.object({
    userId: z.string().cuid("Invalid user ID format"),
    role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
  }),
});
