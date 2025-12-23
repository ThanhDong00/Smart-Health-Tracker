import apiClient from "@/config/axios";
import { ApiResponse } from "@/entity/apiResponse";

export interface StepData {
  date: string;
  steps: number;
  distance?: number;
  calories?: number;
}

export interface SyncQueueItem {
  date: string;
  steps: number;
  timestamp: number;
}

export const stepService = {
  // Sync steps to backend
  async syncSteps(stepData: StepData): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post("/health/steps", stepData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to sync steps");
    }
  },

  // Get step history (optional for future use)
  async getStepHistory(
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<StepData[]>> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await apiClient.get("/health/steps", { params });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch step history"
      );
    }
  },
};
