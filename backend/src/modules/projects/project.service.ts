import { prisma } from "../../utils/prisma";
import { z } from "zod";
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
} from "./project.schema";
import type { Role } from "@prisma/client";

type CreateInput = z.infer<typeof createProjectSchema>["body"];
type UpdateInput = z.infer<typeof updateProjectSchema>["body"];
type AddMemberInput = z.infer<typeof addMemberSchema>["body"];

export const projectService = {
  async create(data: CreateInput, userId: string) {
    // Creates the project AND automatically adds the creator as a Project Admin
    return prisma.project.create({
      data: {
        ...data,
        createdById: userId,
        members: {
          create: {
            userId,
            role: "ADMIN",
          },
        },
      },
    });
  },

  async getAll(userId: string, userRole: Role) {
    // Admins see all projects. Members see only projects they belong to.
    const whereClause =
      userRole === "ADMIN" ? {} : { members: { some: { userId } } };

    return prisma.project.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { tasks: true, members: true },
        },
        members: {
          take: 5, // Just grab a few for the UI avatars
          include: {
            user: { select: { id: true, name: true, avatarColor: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(projectId: string, userId: string, userRole: Role) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarColor: true },
            },
          },
        },
        _count: { select: { tasks: true } },
      },
    });

    if (!project) throw new Error("Project not found");

    // Security check: ensure user is part of the project (if not a system Admin)
    if (
      userRole !== "ADMIN" &&
      !project.members.some((m) => m.userId === userId)
    ) {
      throw new Error("Forbidden: You are not a member of this project");
    }

    return project;
  },

  async update(projectId: string, data: UpdateInput) {
    return prisma.project.update({
      where: { id: projectId },
      data,
    });
  },

  async delete(projectId: string) {
    // Because we set onDelete: Cascade in Prisma, this safely wipes related Tasks and ProjectMembers automatically.
    return prisma.project.delete({
      where: { id: projectId },
    });
  },

  async addMember(projectId: string, data: AddMemberInput) {
    // Check if user is already in the project
    const existing = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: data.userId, projectId } },
    });

    if (existing) throw new Error("User is already a member of this project");

    return prisma.projectMember.create({
      data: {
        projectId,
        userId: data.userId,
        role: data.role,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarColor: true },
        },
      },
    });
  },

  async removeMember(projectId: string, memberId: string) {
    return prisma.projectMember.delete({
      where: { userId_projectId: { userId: memberId, projectId } },
    });
  },
};
