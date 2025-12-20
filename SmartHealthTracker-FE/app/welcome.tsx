import PrimaryButton from "@/components/primary-button";
import SecondaryButton from "@/components/secondary-button";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack } from "expo-router";
import { Text, useColorScheme, View } from "react-native";

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const loginButtonHandle = () => {
    router.push("/auth/login");
  };

  const signupButtonHandle = () => {
    router.push("/auth/signup");
  };

  return (
    <View
      className={`pt-24 p-8 flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      }`}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Logo & Button */}
      <View className="flex-1 items-center justify-center gap-8">
        <MaterialIcons
          name="code"
          size={64}
          color={isDark ? "#00b894" : "#7f27ff"}
        />

        <View className="items-center gap-2">
          <Text
            className={`text-4xl font-bold ${
              isDark ? "text-text-primary" : "text-text-dark"
            }`}
          >
            Let's Get Started!
          </Text>
          <Text
            className={`text-base font-light ${
              isDark ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            Let's dive in into your account
          </Text>
        </View>

        <View className="flex-col gap-4 w-full">
          <SecondaryButton
            title="Sign up"
            onPress={signupButtonHandle}
            isDark={isDark}
          />
          <PrimaryButton
            title="Log in"
            onPress={loginButtonHandle}
            isDark={isDark}
          />
        </View>
      </View>

      {/* Privacy & Term */}
      <View className="flex-row gap-2 items-center justify-center mt-8">
        <Text
          className={`text-sm ${
            isDark ? "text-text-secondary" : "text-text-muted"
          }`}
        >
          Privacy Policy
        </Text>
        <Entypo
          name="dot-single"
          size={16}
          color={isDark ? "#a6adc8" : "#64748b"}
        />
        <Text
          className={`text-sm ${
            isDark ? "text-text-secondary" : "text-text-muted"
          }`}
        >
          Terms of Service
        </Text>
      </View>
    </View>
  );
}
