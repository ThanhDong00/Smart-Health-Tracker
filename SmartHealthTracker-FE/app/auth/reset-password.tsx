import PasswordInput from "@/components/password-input";
import PrimaryButton from "@/components/primary-button";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function ResetPasswordScreen() {
  const [resetForm, setResetForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const updateForm = (key: keyof typeof resetForm) => (value: string) =>
    setResetForm((prev) => ({ ...prev, [key]: value }));

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
        <View>
          <Text className="text-3xl font-bold">Reset Your Password</Text>
          <Text className="text-base font-light py-2 text-justify">
            Choose a new password for your account.
          </Text>

          <View>
            <PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              value={resetForm.newPassword}
              onChangeText={updateForm("newPassword")}
              visible={isPasswordVisible}
              onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="Re-enter your new password"
              value={resetForm.confirmNewPassword}
              onChangeText={updateForm("confirmNewPassword")}
              visible={isConfirmPasswordVisible}
              onToggle={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            />
          </View>
        </View>

        <View>
          <PrimaryButton
            title="Save New Password"
            onPress={() => {
              console.log(resetForm);
              router.push("/auth/reset-password-successful");
            }}
          />
        </View>
      </View>
    </>
  );
}
