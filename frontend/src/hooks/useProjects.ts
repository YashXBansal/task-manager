import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "../api/project.api";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: projectApi.getAll,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectApi.create,
    onSuccess: () => {
      // Instantly refreshes the UI when a new project is created
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
