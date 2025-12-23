import * as SecureStore from "expo-secure-store";

const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
  REFRESH_TOKEN: "refresh_token",
  REMEMBER_ME: "remember_me",
} as const;

export const secureStorageService = {
  async saveUser(user: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user to secure storage:", error);
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const user = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error("Error saving token to secure storage:", error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  async saveRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error("Error saving refresh token:", error);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  async saveRememberMe(rememberMe: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        STORAGE_KEYS.REMEMBER_ME,
        rememberMe.toString()
      );
    } catch (error) {
      console.error("Error saving remember me:", error);
    }
  },

  async getRememberMe(): Promise<boolean> {
    try {
      const value = await SecureStore.getItemAsync(STORAGE_KEYS.REMEMBER_ME);
      return value === "true";
    } catch (error) {
      console.error("Error getting remember me:", error);
      return false;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.USER),
        SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.REMEMBER_ME),
      ]);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};
