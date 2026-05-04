export type Role = "ADMIN" | "MEMBER";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  createdAt: string;
  _count?: { tasks: number; members: number };
  members?: ProjectMember[];
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: Role;
  user?: Pick<User, "id" | "name" | "email" | "avatarColor">;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  projectId: string;
  assignedToId: string | null;
  createdById: string;
  assignedTo?: Pick<User, "id" | "name" | "avatarColor">;
  project?: Pick<Project, "id" | "name" | "color">;
}
