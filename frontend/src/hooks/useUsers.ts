import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios.instance";
import type { User, ApiResponse } from "../types";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User[]>>("/users");
      return data.data;
    },
  });
};
