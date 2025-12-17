import PrimaryButton from "@/components/primary-button";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function WorkoutScreen() {
  const handleNewRun = () => {
    router.push("/workout/live-tracking");
  };

  return (
    <View className="flex-1 flex-col p-8 bg-background gap-4 justify-between">
      <View className="mb-2">
        <Text className="text-3xl font-bold">Workout Screen</Text>
        <Text className="text-lg">
          This is where workout details will be displayed.
        </Text>
      </View>
      <View className="w-16 h-16 rounded-full overflow-hidden bg-primary self-center">
        <PrimaryButton title="+" onPress={handleNewRun} />
      </View>
    </View>
  );
}
