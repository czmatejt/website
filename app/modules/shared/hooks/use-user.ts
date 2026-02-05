import { useQuery } from "@tanstack/react-query";
import { apiClient } from "~/lib/api-client";

export interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatarUrl?: string;
  trainer_id?: string;
}


export function useUser() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      // Assuming your endpoint is /users/me based on standard FastAPI patterns
      // Adjust URL if your UserService uses a different one
      return await apiClient.get<UserProfile>("/user/me");
    },
    // Don't refetch user profile constantly, it rarely changes
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false,
  });

  return { 
    user: data, 
    isLoading, 
    isError: !!error,
    isAuthenticated: !!data 
  };
}