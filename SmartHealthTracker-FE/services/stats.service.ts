import apiClient from "@/config/axios";
import { ApiResponse } from "@/entity/apiResponse";
import { HealthSummary, StatsRange, WeeklyStats } from "@/entity/stats";

const unwrap = <T>(payload: ApiResponse<T> | T): T => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in (payload as ApiResponse<T>)
  ) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const StatsService = {
  getDailySummary: async (date?: string): Promise<HealthSummary> => {
    const targetDate = date ?? formatDate(new Date());

    try {
      const response = await apiClient.get<ApiResponse<HealthSummary> | HealthSummary>(
        "/health/summary",
        {
          params: { date: targetDate },
        }
      );
      return unwrap<HealthSummary>(response.data);
    } catch (error) {
      console.error("Error fetching daily health summary:", error);
      throw error;
    }
  },

  getWeeklyStats: async (startDate: string, endDate: string): Promise<WeeklyStats> => {
    try {
      const [workoutRes, sleepRes, heartRateRes] = await Promise.all([
        apiClient.get<ApiResponse<StatsRange> | StatsRange>("/stats/workout/range", {
          params: { startDate, endDate },
        }),
        apiClient.get<ApiResponse<StatsRange> | StatsRange>("/stats/sleep/range", {
          params: { startDate, endDate },
        }),
        apiClient.get<ApiResponse<StatsRange> | StatsRange>("/stats/heart-rate/range", {
          params: { startDate, endDate },
        }),
      ]);

      return {
        workout: unwrap<StatsRange>(workoutRes.data),
        sleep: unwrap<StatsRange>(sleepRes.data),
        heartRate: unwrap<StatsRange>(heartRateRes.data),
      };
    } catch (error) {
      console.error("Error fetching weekly stats:", error);
      throw error;
    }
  },
};

