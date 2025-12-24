import apiClient from "@/config/axios";
import { CreateWorkoutDto } from "@/entity/workout";

export const WorkoutService = {
  createWorkout: async (data: CreateWorkoutDto, userId: number) => {
    try {
      const response = await apiClient.post("/health/workouts", data, {
        params: { userId },
      });
      console.log("Workout created");
      return response.data;
    } catch (error) {
      console.error("Error creating workout:", error);
      throw error;
    }
  },

  getWorkouts: async (fromDate: string, toDate: string) => {
    try {
      const response = await apiClient.get("/health/workouts/history", {
        params: { fromDate, toDate },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching workouts:", error);
      throw error;
    }
  },

  getWorkoutById: async (id: string) => {
    try {
      const response = await apiClient.get(`/health/workouts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching workout:", error);
      throw error;
    }
  },
};
