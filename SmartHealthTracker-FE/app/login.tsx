import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Text>Login Screen</Text>
    </View>
  );
}
