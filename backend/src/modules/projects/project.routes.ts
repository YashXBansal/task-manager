import { Router } from "express";
import { projectController } from "./project.controller";
import { protect } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
} from "./project.schema";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

// ALL project routes require authentication
router.use(protect);

// My Projects
router.get("/", asyncHandler(projectController.getAll));
router.get("/:id", asyncHandler(projectController.getById));

// Admin Only Routes
router.post(
  "/",
  requireRole("ADMIN"),
  validate(createProjectSchema),
  asyncHandler(projectController.create),
);
router.put(
  "/:id",
  requireRole("ADMIN"),
  validate(updateProjectSchema),
  asyncHandler(projectController.update),
);
router.delete(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(projectController.delete),
);

// Member Management (Admin Only)
router.post(
  "/:id/members",
  requireRole("ADMIN"),
  validate(addMemberSchema),
  asyncHandler(projectController.addMember),
);
router.delete(
  "/:id/members/:uid",
  requireRole("ADMIN"),
  asyncHandler(projectController.removeMember),
);

export default router;
