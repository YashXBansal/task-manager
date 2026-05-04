import { prisma } from "../../utils/prisma";
import { z } from "zod";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "./task.schema";
import type { Role } from "@prisma/client";

type CreateInput = z.infer<typeof createTaskSchema>["body"];
type UpdateInput = z.infer<typeof updateTaskSchema>["body"];
type UpdateStatusInput = z.infer<typeof updateTaskStatusSchema>["body"];

export const taskService = {
  async create(projectId: string, data: CreateInput, userId: string) {
    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new Error("Project not found");

    return prisma.task.create({
      data: {
        ...data,
        projectId,
        createdById: userId,
      },
      include: {
        assignedTo: { select: { id: true, name: true, avatarColor: true } },
      },
    });
  },

  async getByProject(projectId: string) {
    return prisma.task.findMany({
      where: { projectId },
      include: {
        assignedTo: { select: { id: true, name: true, avatarColor: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getMyTasks(userId: string) {
    return prisma.task.findMany({
      where: { assignedToId: userId },
      include: {
        project: { select: { id: true, name: true, color: true } },
      },
      orderBy: { dueDate: "asc" },
    });
  },

  async getOverdueTasks() {
    return prisma.task.findMany({
      where: {
        dueDate: { lt: new Date() },
        status: { not: "DONE" },
      },
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: "asc" },
    });
  },

  async update(
    taskId: string,
    data: UpdateInput,
    userId: string,
    userRole: Role,
  ) {
    // Check if task exists
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new Error("Task not found");

    // Only Admins or the Project Creator can fully update tasks
    if (userRole !== "ADMIN") {
      const project = await prisma.project.findUnique({
        where: { id: task.projectId },
      });
      if (project?.createdById !== userId) {
        throw new Error(
          "Forbidden: Only project admins can fully update tasks",
        );
      }
    }

    return prisma.task.update({
      where: { id: taskId },
      data,
      include: {
        assignedTo: { select: { id: true, name: true, avatarColor: true } },
      },
    });
  },

  async updateStatus(
    taskId: string,
    data: UpdateStatusInput,
    userId: string,
    userRole: Role,
  ) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { include: { members: true } } },
    });

    if (!task) throw new Error("Task not found");

    // Any project member can update the status
    if (
      userRole !== "ADMIN" &&
      !task.project.members.some((m) => m.userId === userId)
    ) {
      throw new Error("Forbidden: You are not a member of this project");
    }

    return prisma.task.update({
      where: { id: taskId },
      data: { status: data.status },
    });
  },

  async delete(taskId: string) {
    return prisma.task.delete({
      where: { id: taskId },
    });
  },
};
