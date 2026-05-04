import { Router } from "express";
import { userController } from "./user.controller";
import { protect } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

// All routes require authentication
router.use(protect);

// GET /api/users -> Admin only (for assignment dropdowns)
router.get("/", requireRole("ADMIN"), asyncHandler(userController.getAll));

// GET /api/users/:id -> Anyone can view a teammate's profile
router.get("/:id", asyncHandler(userController.getById));

export default router;
