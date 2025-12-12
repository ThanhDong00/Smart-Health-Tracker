import PrimaryButton from "@/components/primary-button";
import { router, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function ResetPasswordSuccessfulScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="flex-1 bg-white p-8 gap-4 justify-between">
        <View className="flex-1 justify-center items-center">
          <Text className="text-3xl font-bold">You're All Set!</Text>
          <Text className="text-base font-light py-2 text-justify">
            Your password has been successfully update.
          </Text>
        </View>

        <View>
          <PrimaryButton
            title="Go to Login"
            onPress={() => {
              router.replace("/auth/login");
            }}
          />
        </View>
      </View>
    </>
  );
}
