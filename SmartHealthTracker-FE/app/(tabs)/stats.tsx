import { useMemo } from "react";
import { Dimensions, ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart, LineChart } from "react-native-gifted-charts";

const MOCK_DATA = {
  healthScore: 85,
  subtitle: "December 2025",
  stats: [
    { label: "Steps", value: "5,432", accent: "#4f46e5" },
    { label: "Sleep", value: "7h", accent: "#22c55e" },
    { label: "Calories", value: "320", accent: "#f97316" },
    { label: "Heart Rate", value: "78", accent: "#ef4444" },
  ],
  weeklySteps: [
    { value: 3200, label: "M", frontColor: "#4f46e5" },
    { value: 5400, label: "T", frontColor: "#4f46e5" },
    { value: 4800, label: "W", frontColor: "#4f46e5" },
    { value: 6100, label: "T", frontColor: "#4f46e5" },
    { value: 7000, label: "F", frontColor: "#4f46e5" },
    { value: 5300, label: "S", frontColor: "#4f46e5" },
    { value: 4500, label: "S", frontColor: "#4f46e5" },
  ],
  heartRateTrend: [
    { value: 76, label: "M" },
    { value: 80, label: "T" },
    { value: 78, label: "W" },
    { value: 82, label: "T" },
    { value: 79, label: "F" },
    { value: 81, label: "S" },
    { value: 77, label: "S" },
  ],
};

export default function StatsScreen() {
  const chartWidth = useMemo(() => {
    const screenWidth = Dimensions.get("window").width;
    return Math.min(screenWidth - 48, 360);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 py-4 gap-6">
          <View className="gap-1">
            <Text className="text-2xl font-bold text-neutral-900">
              Statistics
            </Text>
            <Text className="text-base text-neutral-500">
              {MOCK_DATA.subtitle}
            </Text>
          </View>

          <View className="items-center">
            <View className="w-40 h-40 rounded-full bg-indigo-50 border-4 border-indigo-500 items-center justify-center shadow-md">
              <Text className="text-3xl font-bold text-indigo-700">
                {MOCK_DATA.healthScore}
              </Text>
              <Text className="text-sm text-indigo-500 mt-1">/ 100</Text>
              <View className="mt-3 px-3 py-1 rounded-full bg-indigo-100">
                <Text className="text-xs font-semibold text-indigo-700">
                  Health Score
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row flex-wrap justify-between gap-3">
            {MOCK_DATA.stats.map((item) => (
              <View
                key={item.label}
                className="w-[48%] rounded-2xl bg-neutral-50 border border-neutral-100 p-4 shadow-sm"
                style={{ shadowOpacity: 0.08, shadowRadius: 6 }}
              >
                <Text className="text-neutral-500 text-sm">{item.label}</Text>
                <Text
                  className="text-2xl font-bold mt-2"
                  style={{ color: item.accent }}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          <View className="rounded-2xl bg-white border border-neutral-100 p-4 shadow-sm">
            <Text className="text-lg font-semibold text-neutral-900 mb-3">
              Weekly Steps
            </Text>
            <BarChart
              data={MOCK_DATA.weeklySteps}
              height={200}
              width={chartWidth}
              barWidth={28}
              spacing={14}
              roundedTop
              isAnimated
              xAxisThickness={0}
              yAxisThickness={0}
              noOfSections={4}
              maxValue={7500}
              frontColor="#4f46e5"
              gradientColor="#a5b4fc"
              hideRules
              hideYAxisText
              yAxisLabelSuffix=""
            />
          </View>

          <View className="rounded-2xl bg-white border border-neutral-100 p-4 shadow-sm">
            <Text className="text-lg font-semibold text-neutral-900 mb-3">
              Heart Rate Trend
            </Text>
            <LineChart
              data={MOCK_DATA.heartRateTrend}
              height={200}
              width={chartWidth}
              isAnimated
              color="#ef4444"
              thickness={3}
              hideDataPoints={false}
              dataPointsColor="#ef4444"
              startFillColor="#fecdd3"
              endFillColor="#fff1f2"
              startOpacity={0.35}
              endOpacity={0}
              initialSpacing={12}
              spacing={28}
              curved
              hideRules
              hideYAxisText
              xAxisThickness={0}
              yAxisThickness={0}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
