import type { Request, Response } from "express";
import { projectService } from "./project.service";
import { ok, created, fail, forbidden } from "../../utils/apiResponse";

export const projectController = {
  create: async (req: Request, res: Response) => {
    try {
      const project = await projectService.create(req.body, req.user!.id);
      created(res, project, "Project created successfully");
    } catch (error: any) {
      fail(res, error.message);
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const projects = await projectService.getAll(
        req.user!.id,
        req.user!.role,
      );
      ok(res, projects);
    } catch (error: any) {
      fail(res, error.message);
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const project = await projectService.getById(
        req.params.id as string,
        req.user!.id,
        req.user!.role,
      );
      ok(res, project);
    } catch (error: any) {
      if (error.message.includes("Forbidden"))
        return void forbidden(res, error.message);
      fail(res, error.message, 404);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const project = await projectService.update(
        req.params.id as string,
        req.body,
      );
      ok(res, project, "Project updated");
    } catch (error: any) {
      fail(res, "Failed to update project");
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await projectService.delete(req.params.id as string);
      ok(res, null, "Project deleted successfully");
    } catch (error: any) {
      fail(res, "Failed to delete project");
    }
  },

  addMember: async (req: Request, res: Response) => {
    try {
      const member = await projectService.addMember(
        req.params.id as string,
        req.body,
      );
      created(res, member, "Member added successfully");
    } catch (error: any) {
      fail(res, error.message);
    }
  },

  removeMember: async (req: Request, res: Response) => {
    try {
      await projectService.removeMember(
        req.params.id as string,
        req.params.uid as string,
      );
      ok(res, null, "Member removed successfully");
    } catch (error: any) {
      fail(res, "Failed to remove member");
    }
  },
};
