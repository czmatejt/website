import { apiClient } from "~/lib/api-client";

// Define the shape of your data
export interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatarUrl?: string;
}

export const UserService = {
  // The function to get the profile
  getProfile: async (): Promise<UserProfile> => {
    // Uses our smart client (handles base URL automatically)
    return await apiClient<UserProfile>("/me");
  },

  // Example: You can add other user-related calls here later
  // updateProfile: (data: Partial<UserProfile>) => ...
};