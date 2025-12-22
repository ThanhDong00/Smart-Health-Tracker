import { useThemeStore } from "@/store/theme.store";

export function useTheme() {
  const { theme, isDark, setTheme, _hasHydrated } = useThemeStore();

  return {
    isDark,
    theme,
    setTheme,
    isHydrated: _hasHydrated,
  };
}
