import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi, type CreateTaskPayload } from "../api/task.api";
import { api } from "../api/axios.instance";
import type { TaskStatus, Task, ApiResponse } from "../types";
import { useAuthStore } from "../store/auth.store";

export const useProjectTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => taskApi.getByProject(projectId),
    enabled: !!projectId,
  });
};

export const useCreateTask = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    // 🔥 Replaced 'any' with our strictly typed 'CreateTaskPayload'
    mutationFn: (data: CreateTaskPayload) => taskApi.create(projectId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", projectId] }),
  });
};

// Optimistic update for buttery smooth Drag & Drop
export const useUpdateTaskStatus = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      taskApi.updateStatus(taskId, status),
    onMutate: async ({ taskId, status }) => {
      await qc.cancelQueries({ queryKey: ["tasks", projectId] });
      const previousTasks = qc.getQueryData<Task[]>(["tasks", projectId]);

      // 🔥 Instantly update UI before server responds (Replaced 'any' with strict 'Task' types)
      qc.setQueryData<Task[]>(["tasks", projectId], (old) =>
        old?.map((t) => (t.id === taskId ? { ...t, status } : t)),
      );

      return { previousTasks };
    },
    onError: (_err, _newTask, context) => {
      // Rollback on failure
      qc.setQueryData(["tasks", projectId], context?.previousTasks);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
};

export const useMyTasks = () => {
  const user = useAuthStore((state) => state.user); // <-- Grab the user
  return useQuery({
    queryKey: ["my-tasks", user?.id], // <-- Make the cache key unique to the user!
    queryFn: async () => {
      // 🔥 Added the missing 'api', 'ApiResponse', and 'Task' imports at the top!
      const { data } = await api.get<ApiResponse<Task[]>>("/tasks/my");
      return data.data;
    },
  });
};

export const useUpdateMyTaskStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      taskApi.updateStatus(taskId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] }); // Keep dashboard in sync
    },
  });
};
