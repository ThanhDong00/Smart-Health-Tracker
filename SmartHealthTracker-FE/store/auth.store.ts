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
  signIn: (email: string, password: string) => Promise<void>;
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

  signIn: async (email, password) => {
    try {
      set({ isLoading: true });
      const user = await authService.signIn(email, password);
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
        useUserStore.getState().setProfile(profile);
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
        useUserStore.getState().setProfile(profile);
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
    try {
      set({ isLoading: true });

      const [savedUser, savedToken] = await Promise.all([
        secureStorageService.getUser(),
        secureStorageService.getToken(),
      ]);

      if (savedUser && savedToken) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          const newToken = await currentUser.getIdToken(true);
          await secureStorageService.saveToken(newToken);

          set({
            user: currentUser,
            token: newToken,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });

          // Load profile from be
          try {
            const profile = await UserService.getUserProfile();
            useUserStore.getState().setProfile(profile);
          } catch (error) {
            console.error("Failed to load user profile:", error);
          }
        } else {
          await secureStorageService.clearAll();

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
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
