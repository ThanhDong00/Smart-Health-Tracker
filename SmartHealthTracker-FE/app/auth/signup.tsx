import PasswordInput from "@/components/password-input";
import PrimaryButton from "@/components/primary-button";
import { useAuth } from "@/hooks/useAuth";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function SignupScreen() {
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
        }}
      />

      <View className="flex-1 bg-white p-8 gap-4 justify-between">
        {/* Welcome text */}
        <View>
          <Text className="text-3xl font-bold">Join Health Tracker Today</Text>
          <Text className="text-base font-light py-2">
            Create your account to get started!
          </Text>
        </View>

        {/* Sign up form */}
        <View>
          <Text className="text-sm font-medium mb-1">Email</Text>
          <View className="flex-row items-center bg-light_inputBackground dark:bg-dark_inputBackground rounded-lg px-4 mb-4">
            <TextInput
              className="flex-1 py-3 pr-3 text-base"
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={signupForm.email}
              onChangeText={updateForm("email")}
            />
          </View>

          <PasswordInput
            label="Password"
            value={signupForm.password}
            onChangeText={updateForm("password")}
            visible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
            placeholder="Enter your password"
          />

          <PasswordInput
            label="Confirm Password"
            value={signupForm.confirmPassword}
            onChangeText={updateForm("confirmPassword")}
            visible={confirmPasswordVisible}
            onToggle={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            placeholder="Re-enter your password"
          />
        </View>

        <View className="gap-4">
          {/* Sign up button */}
          <View>
            <PrimaryButton
              title={isLoading ? "Creating Account..." : "Sign Up"}
              onPress={handleSignUp}
              disabled={isLoading}
            />
          </View>

          {/* Sign in link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-sm text-gray-600">
              Already have an account?
            </Text>

            <Pressable
              onPress={() => {
                router.replace("/auth/login");
              }}
            >
              <Text className="text-sm underline ml-1">Sign in</Text>
            </Pressable>
          </View>

          <View className="flex-row items-center">
            <View className="flex-1 bg-black shrink-0 h-[1px] w-full" />
            <Text className="text-muted-foreground px-4 text-sm">or</Text>
            <View className="flex-1 bg-black shrink-0 h-[1px] w-full" />
          </View>
        </View>
      </View>
    </>
  );
}
