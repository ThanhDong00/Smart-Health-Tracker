import PrimaryButton from "@/components/primary-button";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

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
          <Text className="text-3xl font-bold">Forgot Your Password?</Text>
          <Text className="text-base font-light py-2 text-justify">
            Enter your email associated with your account below. We will send
            you a one-time passcode (OTP) to reset your password.
          </Text>

          {/* Input */}
          <Text className="text-sm font-medium mb-1 mt-8">
            Your Registered Email
          </Text>
          <View className="flex-row items-center bg-light_inputBackground dark:bg-dark_inputBackground rounded-lg px-4 mb-4">
            <TextInput
              className="flex-1 py-3 pr-3 text-base"
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Button */}
        <View>
          <PrimaryButton
            title="Send OTP Code"
            onPress={() => {
              router.push("/auth/verify-otp");
            }}
          />
        </View>
      </View>
    </>
  );
}
