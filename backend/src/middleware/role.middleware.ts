import type { Request, Response, NextFunction } from "express";
import { forbidden } from "../utils/apiResponse";
import type { Role } from "@prisma/client";

export const requireRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role as Role)) {
      forbidden(res, "You do not have permission to perform this action");
      return;
    }
    next();
  };
};
