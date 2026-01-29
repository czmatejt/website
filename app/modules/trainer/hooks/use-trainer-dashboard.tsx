import { useQuery } from "@tanstack/react-query";
import { apiClient } from "~/lib/api-client"; // Your helper
import { type DashboardTraining } from "./../types/trainer";

export function useTrainerSchedule() {
  return useQuery({
    queryKey: ["trainer", "schedule"],
    queryFn: async () => {
      // apiClient.get returns the parsed JSON automatically (usually)
      return await apiClient<DashboardTraining[]>("/v1/trainer/dashboard/schedule");
    },
    // Refresh data every 5 minutes automatically
    refetchInterval: 1000 * 60 * 5, 
  });
}