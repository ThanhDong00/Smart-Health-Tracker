import apiClient from "@/config/axios";
import { UserProfile } from "@/entity/user";

export const UserService = {
  getUserProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};
