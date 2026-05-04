import { Router } from "express";
import { taskController } from "./task.controller";
import { protect } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "./task.schema";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router({ mergeParams: true }); // Allows access to :projectId from parent router

router.use(protect);

// Global Task Routes
router.get("/my", asyncHandler(taskController.getMyTasks));
router.get(
  "/overdue",
  requireRole("ADMIN"),
  asyncHandler(taskController.getOverdue),
);

// Single Task Routes
router.put(
  "/:id",
  validate(updateTaskSchema),
  asyncHandler(taskController.update),
);
router.patch(
  "/:id/status",
  validate(updateTaskStatusSchema),
  asyncHandler(taskController.updateStatus),
);
router.delete(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(taskController.delete),
);

// Project-Specific Task Routes
router.get("/project/:projectId", asyncHandler(taskController.getByProject));
router.post(
  "/project/:projectId",
  requireRole("ADMIN"),
  validate(createTaskSchema),
  asyncHandler(taskController.create),
);

export default router;
