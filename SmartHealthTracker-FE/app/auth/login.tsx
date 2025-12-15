import PasswordInput from "@/components/password-input";
import PrimaryButton from "@/components/primary-button";
import { useAuth } from "@/hooks/useAuth";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
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
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await signIn(signInForm.email, signInForm.password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign in");
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
          <Text className="text-3xl font-bold">Welcome Back!</Text>
          <Text className="text-base font-light py-2">
            Sign in to continue tracking your health.
          </Text>
        </View>

        {/* Form */}
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
              value={signInForm.email}
              onChangeText={updateForm("email")}
            />
          </View>

          <PasswordInput
            label="Password"
            value={signInForm.password}
            onChangeText={updateForm("password")}
            visible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
            placeholder="Enter your password"
          />

          {/* Remember me & Forgot password */}
          <View className="flex-row items-center justify-between mb-4">
            <Pressable
              className="flex-row items-center gap-2"
              onPress={() => setRememberMe((prev) => !prev)}
            >
              <View
                className={`h-5 w-5 rounded border border-gray-400 items-center justify-center ${
                  rememberMe ? "bg-primary" : "bg-transparent"
                }`}
              >
                {rememberMe ? (
                  <Text className="text-white text-xs">✓</Text>
                ) : null}
              </View>
              <Text className="text-sm text-gray-700">Remember me</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/auth/forgot")}>
              <Text className="text-sm text-primary underline">
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
            />
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
