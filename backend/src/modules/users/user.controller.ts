import type { Request, Response } from "express";
import { userService } from "./user.service";
import { ok, fail } from "../../utils/apiResponse";

export const userController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const users = await userService.getAll();
      ok(res, users);
    } catch (error: any) {
      fail(res, "Failed to fetch users");
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const user = await userService.getById(req.params.id as string);
      ok(res, user);
    } catch (error: any) {
      fail(res, error.message, 404);
    }
  },
};
