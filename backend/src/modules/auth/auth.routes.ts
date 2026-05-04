import { Router } from "express";
import { authController } from "./auth.controller";
import { protect } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { signupSchema, loginSchema } from "./auth.schema";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.post(
  "/signup",
  validate(signupSchema),
  asyncHandler(authController.signup),
);
router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(authController.login),
);
router.get("/me", protect, asyncHandler(authController.getMe));

export default router;
