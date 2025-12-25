import PrimaryButton from "@/components/primary-button";
import InputField from "@/components/ui/input-field";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function ForgotPasswordScreen() {
  const { isDark } = useTheme();
  const { sendPasswordReset, isLoading } = useAuth();
  const [email, setEmail] = useState("");

  const handleSendResetEmail = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your email",
      });
      return;
    }

    try {
      await sendPasswordReset(email);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Password reset email sent. Please check your inbox.",
      });
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to send reset email",
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
            Forgot Your Password?
          </Text>
          <Text
            className={`text-base font-light py-2 text-justify ${
              isDark ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            Enter your email associated with your account below. We will send
            you a one-time passcode (OTP) to reset your password.
          </Text>

          {/* Input */}
          <View className="mt-8">
            <InputField
              headIcon={
                <MaterialIcons
                  name="mail"
                  size={24}
                  color={isDark ? "#00b894" : "#7f27ff"}
                />
              }
              label="Your Registered Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChange={setEmail}
              isDark={isDark}
            />
          </View>
        </View>

        {/* Button */}
        <View>
          {/* <PrimaryButton
            title="Send OTP Code"
            onPress={() => {
              router.push("/auth/verify-otp");
            }}
          /> */}
          <PrimaryButton
            title={isLoading ? "Sending..." : "Send Reset Link"}
            onPress={handleSendResetEmail}
            isDark={isDark}
          />
        </View>
      </View>
    </>
  );
}
