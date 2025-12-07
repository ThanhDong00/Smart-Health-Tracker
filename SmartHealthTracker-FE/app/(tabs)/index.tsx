import { CardCollapsible } from "@/components/ui/card-collapsible";
import ProgressBar from "@/components/ui/progress-bar-h";
import SleepBarChart from "@/components/ui/sleep-bar-chart";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-neutral-100 p-8 felx-col gap-4">
      {/* Walk */}
      <CardCollapsible title="Daily Walking" subtitle="Total steps in a day">
        <View>
          <ProgressBar current={6754} max={10000} />

          <View className="mt-2 flex-row justify-between">
            <View>
              <Text className="text-sm">6754 steps</Text>
            </View>
            <View>
              <Text className="text-sm">10,000 steps goal</Text>
            </View>
          </View>
        </View>
      </CardCollapsible>

      <CardCollapsible title="Heart Rate" subtitle="72 bpm" />

      {/* Sleep */}
      <CardCollapsible
        title="Sleep Tracking"
        subtitle="Sleep duration in hours"
      >
        <SleepBarChart />
      </CardCollapsible>
    </View>
  );
}
