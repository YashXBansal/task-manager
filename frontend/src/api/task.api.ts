import { api } from "./axios.instance";
import type { Task, ApiResponse, TaskStatus, Priority } from "../types";

// Strictly type the payload based on what the backend expects
export interface CreateTaskPayload {
  title: string;
  description?: string | null;
  priority: Priority;
  status: TaskStatus;
  assignedToId?: string | null;
  dueDate?: string | null;
}

export const taskApi = {
  getByProject: async (projectId: string) => {
    const { data } = await api.get<ApiResponse<Task[]>>(
      `/tasks/project/${projectId}`,
    );
    return data.data;
  },

  // Replaced 'any' with our strict 'CreateTaskPayload' type
  create: async (projectId: string, taskData: CreateTaskPayload) => {
    const { data } = await api.post<ApiResponse<Task>>(
      `/tasks/project/${projectId}`,
      taskData,
    );
    return data.data;
  },

  updateStatus: async (taskId: string, status: TaskStatus) => {
    const { data } = await api.patch<ApiResponse<Task>>(
      `/tasks/${taskId}/status`,
      { status },
    );
    return data.data;
  },
};
