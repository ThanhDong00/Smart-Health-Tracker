import PrimaryButton from "@/components/primary-button";
import { Stack } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";

export default function SignupScreen() {
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
          <Text className="text-base font-light">
            Create your account to get started!
          </Text>
        </View>

        {/* Sign up form */}
        <View>
          {/* Input */}
          <Text className="px-4">Email</Text>
          <TextInput
            className="bg-light_inputBackground dark:bg-dark_inputBackground p-4 rounded-lg mb-4"
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <Text>Password</Text>
          <TextInput placeholder="Enter your password" secureTextEntry />

          <Text>Confirm Password</Text>
          <TextInput placeholder="Confirm your password" secureTextEntry />
        </View>

        <View className="gap-4">
          {/* Sign up button */}
          <View>
            <PrimaryButton title="Sign Up" onPress={() => {}} />
          </View>

          {/* Sign in link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-sm text-gray-600">
              Already have an account?
            </Text>

            <Pressable onPress={() => {}}>
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
