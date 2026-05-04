import { api } from "./axios.instance";
import type { Project, ApiResponse } from "../types";

export const projectApi = {
  getAll: async () => {
    const { data } = await api.get<ApiResponse<Project[]>>("/projects");
    return data.data;
  },
  create: async (projectData: {
    name: string;
    description?: string;
    color: string;
  }) => {
    const { data } = await api.post<ApiResponse<Project>>(
      "/projects",
      projectData,
    );
    return data.data;
  },
};
