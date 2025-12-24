import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart, LineChart } from "react-native-gifted-charts";

import { HealthSummary, WeeklyStats } from "@/entity/stats";
import { StatsService } from "@/services/stats.service";

const CHART_MOCKS = {
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

type ViewMode = "daily" | "weekly";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCurrentWeekRange = () => {
  const today = new Date();
  const day = today.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(today);
  start.setDate(today.getDate() + diffToMonday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start: formatDate(start), end: formatDate(end) };
};

const formatNumber = (value?: number, fractionDigits: number = 0) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "-";
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

const formatMinutes = (minutes?: number) => {
  if (minutes === undefined || minutes === null) {
    return "-";
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
};

export default function StatsScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => formatDate(new Date()), []);
  const { start: startOfWeek, end: endOfWeek } = useMemo(
    () => getCurrentWeekRange(),
    []
  );

  const chartWidth = useMemo(() => {
    const screenWidth = Dimensions.get("window").width;
    return Math.min(screenWidth - 48, 360);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (viewMode === "daily") {
          const data = await StatsService.getDailySummary(today);
          if (!isMounted) return;
          setSummary(data);
          setWeeklyStats(null);
        } else {
          const data = await StatsService.getWeeklyStats(startOfWeek, endOfWeek);
          if (!isMounted) return;
          setWeeklyStats(data);
          setSummary(null);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
        if (isMounted) {
          setError("Unable to load stats. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [viewMode, today, startOfWeek, endOfWeek]);

  const statsCards = [
    {
      label: "Steps",
      value: summary ? formatNumber(summary.totalSteps) : "-",
      accent: "#4f46e5",
    },
    {
      label: "Sleep",
      value: summary ? formatMinutes(summary.sleepDurationMinutes) : "-",
      accent: "#22c55e",
    },
    {
      label: "Calories",
      value: summary ? `${formatNumber(summary.kcalBurned)} kcal` : "-",
      accent: "#f97316",
    },
    {
      label: "Heart Rate",
      value: summary ? `${formatNumber(summary.avgHeartRate)} bpm` : "-",
      accent: "#ef4444",
    },
  ];

  const workoutSummaryText =
    viewMode === "weekly" && weeklyStats
      ? `Sessions: ${formatNumber(
          weeklyStats.workout.totalSessions
        )} • Distance: ${formatNumber(
          weeklyStats.workout.totalDistanceMeters
            ? weeklyStats.workout.totalDistanceMeters / 1000
            : undefined,
          2
        )} km • Calories: ${formatNumber(weeklyStats.workout.totalCalories)}`
      : summary
        ? `Workouts today: ${formatNumber(
            summary.workoutCount
          )} • Duration: ${formatNumber(
            summary.workoutDurationMinutes
          )} mins • Distance: ${formatNumber(summary.distanceKm, 2)} km`
        : "Workout stats unavailable";

  const heartRateSummaryText =
    viewMode === "weekly" && weeklyStats
      ? `Avg: ${formatNumber(weeklyStats.heartRate.avgBpm)} bpm • Max: ${formatNumber(
          weeklyStats.heartRate.maxBpm
        )} • Min: ${formatNumber(weeklyStats.heartRate.minBpm)}`
      : summary
        ? `Avg: ${formatNumber(summary.avgHeartRate)} bpm • Max: ${formatNumber(
            summary.maxHeartRate
          )} • Min: ${formatNumber(summary.minHeartRate)}`
        : "Heart rate stats unavailable";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 py-4 gap-6 relative">
          {isLoading && (
            <View className="absolute inset-0 items-center justify-start pt-4">
              <ActivityIndicator size="small" color="#4f46e5" />
            </View>
          )}

          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Text className="text-2xl font-bold text-neutral-900">
                Statistics
              </Text>
              <Text className="text-base text-neutral-500">
                {viewMode === "daily" ? today : `${startOfWeek} - ${endOfWeek}`}
              </Text>
            </View>

            <View className="flex-row bg-neutral-100 rounded-full p-1">
              {(["daily", "weekly"] as ViewMode[]).map((mode) => {
                const isActive = viewMode === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    className={`px-3 py-1 rounded-full ${
                      isActive ? "bg-white shadow-sm" : ""
                    }`}
                    onPress={() => setViewMode(mode)}
                    disabled={isActive}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        isActive ? "text-neutral-900" : "text-neutral-500"
                      }`}
                    >
                      {mode === "daily" ? "Daily" : "Weekly"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="items-center">
            <View className="w-40 h-40 rounded-full bg-indigo-50 border-4 border-indigo-500 items-center justify-center shadow-md">
              <Text className="text-3xl font-bold text-indigo-700">
                {summary?.healthScore ?? "--"}
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
            {statsCards.map((item) => (
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
              {viewMode === "daily" ? "Daily Activity" : "Weekly Activity"}
            </Text>
            <Text className="text-sm text-neutral-500 mb-3">
              {workoutSummaryText}
            </Text>
            {/* TODO: Replace mock chart data once backend provides history list API */}
            <BarChart
              data={CHART_MOCKS.weeklySteps}
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
            <Text className="text-sm text-neutral-500 mb-3">
              {heartRateSummaryText}
            </Text>
            {/* TODO: Replace mock chart data once backend provides history list API */}
            <LineChart
              data={CHART_MOCKS.heartRateTrend}
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

          {error && (
            <View className="rounded-xl bg-red-50 border border-red-100 p-3">
              <Text className="text-sm text-red-600">{error}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
