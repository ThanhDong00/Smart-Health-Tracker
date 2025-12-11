import PrimaryButton from "@/components/primary-button";
import SecondaryButton from "@/components/secondary-button";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack } from "expo-router";
import { Text, useColorScheme, View } from "react-native";

export default function WelcomeScreen() {
  const colorScheme = useColorScheme() ?? "light";

  const loginButtonHandle = () => {
    router.push("/login");
  };

  const signupButtonHandle = () => {
    router.push("/signup");
  };

  return (
    <View className="bg-white pt-24 p-8 flex-1">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Logo & Button */}
      <View className="flex-1 items-center justify-center gap-8">
        <MaterialIcons name="code" size={64} color="black" />

        <View className="items-center gap-2">
          <Text className="text-4xl font-bold">Let's Get Started!</Text>
          <Text className="text-base font-light">
            Let's dive in into your account
          </Text>
        </View>

        <View className="flex-col gap-4 w-full">
          <SecondaryButton title="Sign up" onPress={signupButtonHandle} />
          <PrimaryButton title="Log in" onPress={loginButtonHandle} />
        </View>
      </View>

      {/* Privacy & Term */}
      <View className="flex-row gap-2 items-center justify-center mt-8">
        <Text className="text-sm">Privacy Policy</Text>
        <Entypo name="dot-single" size={16} color="black" />
        <Text className="text-sm">Terms of Service</Text>
      </View>
    </View>
  );
}
