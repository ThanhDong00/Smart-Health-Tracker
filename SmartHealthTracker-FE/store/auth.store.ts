import { authService } from "@/services/auth.service";
import { secureStorageService } from "@/services/secureStorage.sevice";
import { UserService } from "@/services/user.service";
import { User } from "firebase/auth";
import { create } from "zustand";
import { useUserStore } from "./user.store";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setToken: async (token) => {
    if (token) {
      await secureStorageService.saveToken(token);
    } else {
      await secureStorageService.clearAll();
    }
    set({ token });
  },

  signIn: async (email, password, rememberMe = false) => {
    try {
      set({ isLoading: true });
      const user = await authService.signIn(email, password);
      const token = await user.getIdToken();

      // Only save to secure storage if remember me is checked
      if (rememberMe) {
        await secureStorageService.saveUser(user);
        await secureStorageService.saveToken(token);
        await secureStorageService.saveRememberMe(true);
      } else {
        // Clear any previous remember me data
        await secureStorageService.clearAll();
      }

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      // Load profile after sign in from be
      try {
        const profile = await UserService.getUserProfile();
        useUserStore.getState().setProfile(profile.data);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signUp: async (email, password) => {
    try {
      set({ isLoading: true });

      const user = await authService.signUp(email, password);
      const token = await user.getIdToken();

      await secureStorageService.saveUser(user);
      await secureStorageService.saveToken(token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      // Load profile after sign in from be
      try {
        const profile = await UserService.getUserProfile();
        useUserStore.getState().setProfile(profile.data);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });

      await authService.signOut();
      await secureStorageService.clearAll();

      // Clear user profile from store
      useUserStore.getState().clearProfile();

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  sendPasswordReset: async (email) => {
    try {
      set({ isLoading: true });
      await authService.sendPasswordResetEmail(email);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  initialize: async () => {
    const state = useAuthStore.getState();

    // Only run once - if already initialized, skip
    if (state.isInitialized) {
      return;
    }

    try {
      set({ isLoading: true });

      const [savedUser, savedToken, rememberMe] = await Promise.all([
        secureStorageService.getUser(),
        secureStorageService.getToken(),
        secureStorageService.getRememberMe(),
      ]);

      // Only restore session if remember me was checked
      if (savedUser && savedToken && rememberMe) {
        set({
          user: savedUser,
          token: savedToken,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });

        // Load profile from backend in background
        try {
          const profile = await UserService.getUserProfile();
          useUserStore.getState().setProfile(profile.data);
        } catch (error) {
          console.error("Failed to load user profile:", error);
        }

        // Refresh token in background if needed
        // Firebase onAuthStateChanged will handle token refresh
      } else {
        // No remember me - just mark as initialized
        // DON'T clear current session (if user just logged in without remember me)
        // DON'T sign out from Firebase (if user is currently logged in)
        set({
          isLoading: false,
          isInitialized: true,
        });
      }
    } catch (error) {
      console.error("Initialize error:", error);
      set({
        isLoading: false,
        isInitialized: true,
      });
    }
  },
}));
