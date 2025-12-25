import PasswordInput from "@/components/password-input";
import PrimaryButton from "@/components/primary-button";
import InputField from "@/components/ui/input-field";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const { isDark } = useTheme();
  const { signIn, isLoading } = useAuth();
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const updateForm = (key: keyof typeof signInForm) => (value: string) =>
    setSignInForm((prev) => ({ ...prev, [key]: value }));

  const handleSignIn = async () => {
    if (!signInForm.email || !signInForm.password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    try {
      await signIn(signInForm.email, signInForm.password, rememberMe);
      router.replace("/(tabs)");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to sign in",
      });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: isDark ? "#0f0f23" : "#f8fafc",
          },
          headerTintColor: isDark ? "#ffffff" : "#1e293b",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <View
        className={`flex-1 p-8 gap-4 justify-between ${
          isDark ? "bg-background-dark" : "bg-background-light"
        }`}
      >
        {/* Welcome text */}
        <View>
          <Text
            className={`text-3xl font-bold ${
              isDark ? "text-text-primary" : "text-text-dark"
            }`}
          >
            Welcome Back!
          </Text>
          <Text
            className={`text-base font-light py-2 ${
              isDark ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            Sign in to continue tracking your health.
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          <InputField
            headIcon={
              <MaterialIcons
                name="mail"
                size={24}
                color={isDark ? "#00b894" : "#7f27ff"}
              />
            }
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            value={signInForm.email}
            onChange={updateForm("email")}
            isDark={isDark}
          />

          <PasswordInput
            label="Password"
            value={signInForm.password}
            onChangeText={updateForm("password")}
            visible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
            placeholder="Enter your password"
            isDark={isDark}
          />

          {/* Remember me & Forgot password */}
          <View className="flex-row items-center justify-between mb-4">
            <Pressable
              className="flex-row items-center gap-2"
              onPress={() => setRememberMe((prev) => !prev)}
            >
              <View
                className={`h-5 w-5 rounded border items-center justify-center ${
                  rememberMe
                    ? "bg-primary border-primary"
                    : isDark
                      ? "bg-transparent border-text-secondary"
                      : "bg-transparent border-gray-400"
                }`}
              >
                {rememberMe ? (
                  <MaterialIcons name="check" size={16} color="white" />
                ) : null}
              </View>
              <Text
                className={`text-sm ${
                  isDark ? "text-text-secondary" : "text-gray-700"
                }`}
              >
                Remember me
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/auth/forgot")}>
              <Text
                className={`text-sm underline ${
                  isDark ? "text-primary-dark" : "text-primary"
                }`}
              >
                Forgot password?
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Button & other */}
        <View className="gap-4">
          <View>
            <PrimaryButton
              title={isLoading ? "Signing In..." : "Sign In"}
              onPress={handleSignIn}
              disabled={isLoading}
              isDark={isDark}
            />
          </View>

          <View className="flex-row items-center">
            <View
              className={`flex-1 shrink-0 h-[1px] w-full ${
                isDark ? "bg-surface-variant-dark" : "bg-gray-300"
              }`}
            />
            <Text
              className={`px-4 text-sm ${
                isDark ? "text-text-secondary" : "text-text-muted"
              }`}
            >
              or
            </Text>
            <View
              className={`flex-1 shrink-0 h-[1px] w-full ${
                isDark ? "bg-surface-variant-dark" : "bg-gray-300"
              }`}
            />
          </View>
        </View>
      </View>
    </>
  );
}
