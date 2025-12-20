import PasswordInput from "@/components/password-input";
import PrimaryButton from "@/components/primary-button";
import InputField from "@/components/ui/input-field";
import { useAuth } from "@/hooks/useAuth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, useColorScheme, View } from "react-native";

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { signUp, isLoading } = useAuth();
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const updateForm = (key: keyof typeof signupForm) => (value: string) =>
    setSignupForm((prev) => ({ ...prev, [key]: value }));

  const handleSignUp = async () => {
    if (
      !signupForm.email ||
      !signupForm.password ||
      !signupForm.confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (signupForm.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await signUp(signupForm.email, signupForm.password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign up");
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
            backgroundColor: isDark ? "#1a1a1a" : "#f8fafc",
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
            Join Health Tracker Today
          </Text>
          <Text
            className={`text-base font-light py-2 ${
              isDark ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            Create your account to get started!
          </Text>
        </View>

        {/* Sign up form */}
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
            value={signupForm.email}
            onChange={updateForm("email")}
            isDark={isDark}
          />

          <PasswordInput
            label="Password"
            value={signupForm.password}
            onChangeText={updateForm("password")}
            visible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
            placeholder="Enter your password"
            isDark={isDark}
          />

          <PasswordInput
            label="Confirm Password"
            value={signupForm.confirmPassword}
            onChangeText={updateForm("confirmPassword")}
            visible={confirmPasswordVisible}
            onToggle={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            placeholder="Re-enter your password"
            isDark={isDark}
          />
        </View>

        <View className="gap-4">
          {/* Sign up button */}
          <View>
            <PrimaryButton
              title={isLoading ? "Creating Account..." : "Sign Up"}
              onPress={handleSignUp}
              disabled={isLoading}
              isDark={isDark}
            />
          </View>

          {/* Sign in link */}
          <View className="flex-row justify-center items-center">
            <Text
              className={`text-sm ${
                isDark ? "text-text-secondary" : "text-gray-600"
              }`}
            >
              Already have an account?
            </Text>

            <Pressable
              onPress={() => {
                router.replace("/auth/login");
              }}
            >
              <Text
                className={`text-sm underline ml-1 ${
                  isDark ? "text-primary-dark" : "text-primary"
                }`}
              >
                Sign in
              </Text>
            </Pressable>
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
