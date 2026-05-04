import type { Request, Response } from "express";
import { taskService } from "./task.service";
import { ok, created, fail, forbidden } from "../../utils/apiResponse";

export const taskController = {
  create: async (req: Request, res: Response) => {
    try {
      const task = await taskService.create(
        req.params.projectId as string,
        req.body,
        req.user!.id,
      );
      created(res, task, "Task created successfully");
    } catch (error: any) {
      fail(res, error.message);
    }
  },

  getByProject: async (req: Request, res: Response) => {
    try {
      const tasks = await taskService.getByProject(
        req.params.projectId as string,
      );
      ok(res, tasks);
    } catch (error: any) {
      fail(res, error.message);
    }
  },

  getMyTasks: async (req: Request, res: Response) => {
    try {
      const tasks = await taskService.getMyTasks(req.user!.id);
      ok(res, tasks);
    } catch (error: any) {
      fail(res, error.message);
    }
  },

  getOverdue: async (req: Request, res: Response) => {
    try {
      const tasks = await taskService.getOverdueTasks();
      ok(res, tasks);
    } catch (error: any) {
      fail(res, error.message);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const task = await taskService.update(
        req.params.id as string,
        req.body,
        req.user!.id,
        req.user!.role,
      );
      ok(res, task, "Task updated");
    } catch (error: any) {
      if (error.message.includes("Forbidden"))
        return void forbidden(res, error.message);
      fail(res, error.message);
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const task = await taskService.updateStatus(
        req.params.id as string,
        req.body,
        req.user!.id,
        req.user!.role,
      );
      ok(res, task, "Task status updated");
    } catch (error: any) {
      if (error.message.includes("Forbidden"))
        return void forbidden(res, error.message);
      fail(res, error.message);
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await taskService.delete(req.params.id as string);
      ok(res, null, "Task deleted successfully");
    } catch (error: any) {
      fail(res, "Failed to delete task");
    }
  },
};
