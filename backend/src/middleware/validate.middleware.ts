import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { fail } from "../utils/apiResponse";

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as { body?: any; query?: any; params?: any };

      // req.body is fully mutable, so we can reassign it directly
      if (validatedData.body) req.body = validatedData.body;

      // For query and params, we safely merge the transformed data to avoid the getter TypeError
      if (validatedData.query) Object.assign(req.query, validatedData.query);
      if (validatedData.params) Object.assign(req.params, validatedData.params);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details: Record<string, string[]> = {};

        error.issues.forEach((err) => {
          const key = err.path.join(".") || "root";
          if (!details[key]) details[key] = [];
          details[key].push(err.message);
        });

        return void fail(res, "Validation failed", 400, details);
      }

      next(error);
    }
  };
