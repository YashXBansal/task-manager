import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { ok, created, fail } from "../../utils/apiResponse";

export const authController = {
  signup: async (req: Request, res: Response) => {
    try {
      const result = await authService.signup(req.body);
      created(res, result, "User created successfully");
    } catch (error: any) {
      fail(res, error.message, 400);
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const result = await authService.login(req.body);
      ok(res, result, "Logged in successfully");
    } catch (error: any) {
      fail(res, error.message, 401);
    }
  },

  getMe: async (req: Request, res: Response) => {
    try {
      // req.user is guaranteed to exist here because of the 'protect' middleware
      const user = await authService.getMe(req.user!.id);
      ok(res, { user }, "User profile retrieved");
    } catch (error: any) {
      fail(res, error.message, 404);
    }
  },
};
