import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "app-theme";
const normalizeTheme = (value: string | null | ColorSchemeName): ThemeMode => {
  return value === "dark" ? "dark" : "light";
};

export const useTheme = () => {
  const systemScheme = useColorScheme();

  const [theme, setThemeState] = useState<ThemeMode>(
    normalizeTheme(systemScheme ?? "light")
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasStoredTheme, setHasStoredTheme] = useState(false);

  // Hydrate theme preference from storage
  useEffect(() => {
    const hydrateTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") {
          setThemeState(stored);
          setHasStoredTheme(true);
        } else {
          setThemeState(normalizeTheme(systemScheme ?? "light"));
        }
      } catch (error) {
        console.warn("Failed to hydrate theme preference", error);
      } finally {
        setIsHydrated(true);
      }
    };

    hydrateTheme();
  }, [systemScheme]);

  // Keep in sync with system when user has no explicit preference
  useEffect(() => {
    if (!hasStoredTheme && systemScheme) {
      setThemeState(normalizeTheme(systemScheme));
    }
  }, [systemScheme, hasStoredTheme]);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    setHasStoredTheme(true);
    AsyncStorage.setItem(STORAGE_KEY, nextTheme).catch((err) => {
      console.warn("Failed to persist theme preference", err);
    });
  }, []);

  return {
    theme,
    isDark: theme === "dark",
    setTheme,
    isHydrated,
  };
};

