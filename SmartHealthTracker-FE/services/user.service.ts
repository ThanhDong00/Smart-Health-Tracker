import apiClient from "@/config/axios";
import { ApiResponse } from "@/entity/apiResponse";
import { UserProfile } from "@/entity/user";

export const UserService = {
  getUserProfile: async (): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.get("/auth/me");
    console.log("Get profile response:", JSON.stringify(response.data));
    return response.data;
  },

  updateUserProfile: async (data: {
    // email: string;
    fullName: string | null;
    gender: string | null;
    dateOfBirth: Date | null;
    heightCm: number | null;
    weightKg: number | null;
  }): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.put("/auth/me", data);
    console.log("Update profile response:", JSON.stringify(response.data));
    return response.data;
  },

  updateAvatar: async (data: {
    avatarUrl: string;
  }): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.post("/auth/me/avatar", data);
    console.log("Update avatar response:", JSON.stringify(response.data));
    return response.data;
  },
};
