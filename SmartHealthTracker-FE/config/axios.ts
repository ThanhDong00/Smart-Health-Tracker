import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

const API_BASE_URL = "https://smarthealthtracker-backend.onrender.com/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { signOut } = useAuthStore.getState();
      await signOut();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
