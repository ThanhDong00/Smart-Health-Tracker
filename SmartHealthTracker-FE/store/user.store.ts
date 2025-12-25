import { UserProfile } from "@/entity/user";
import { create } from "zustand";

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;

  setProfile: (profile: UserProfile | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,

  setProfile: (profile) => set({ profile }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
