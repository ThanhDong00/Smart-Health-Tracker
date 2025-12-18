import "react-native-reanimated";

import "react-native-gesture-handler";
import "../global.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) {
      console.log("Not initialized yet, waiting...");
      return;
    }

    const inAuthGroup = segments[0] === "(tabs)";
    const inAuthPages = segments[0] === "auth" || segments[0] === "welcome";

    // Chỉ redirect khi:
    // 1. User đã authenticated nhưng đang ở trang auth/welcome
    // 2. User chưa authenticated nhưng đang ở (tabs)
    if (isAuthenticated && (inAuthPages || segments.length === 0)) {
      console.log("Authenticated user, redirecting to tabs");
      router.replace("/(tabs)");
    } else if (!isAuthenticated && inAuthGroup) {
      console.log("Not authenticated, redirecting to welcome");
      router.replace("/welcome");
    }
  }, [isAuthenticated, isInitialized, segments]);

  if (!isInitialized) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#7f27ff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="auth/forgot" />
      <Stack.Screen name="auth/verify-otp" />
      <Stack.Screen name="auth/reset-password" />
      <Stack.Screen name="auth/reset-password-successful" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <RootLayoutNav />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
