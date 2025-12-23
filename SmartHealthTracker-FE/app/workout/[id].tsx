import { useTheme } from "@/hooks/useTheme";
import {
  formatDateTimeFull,
  formatDistance,
  formatDuration,
  formatPace,
  formatSpeed,
} from "@/utils/formatters";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data (same as workout.tsx - in production, fetch from storage)
const mockActivities = [
  {
    id: "1",
    type: "running",
    startTime: "2024-12-24T18:30:00.000Z",
    endTime: "2024-12-24T19:58:10.000Z",
    durationSeconds: 5290,
    distanceMeters: 5200,
    avgSpeedMps: 2.98,
    avgPaceSecPerKm: 335,
    calories: 145,
    gpsPoints: [],
  },
  {
    id: "2",
    type: "running",
    startTime: "2024-12-22T08:00:00.000Z",
    endTime: "2024-12-22T08:18:45.000Z",
    durationSeconds: 1125,
    distanceMeters: 3100,
    avgSpeedMps: 2.76,
    avgPaceSecPerKm: 362,
    calories: 134,
    gpsPoints: [],
  },
  {
    id: "3",
    type: "running",
    startTime: "2024-12-17T18:15:00.000Z",
    endTime: "2024-12-17T19:13:20.000Z",
    durationSeconds: 3500,
    distanceMeters: 10500,
    avgSpeedMps: 3.0,
    avgPaceSecPerKm: 333,
    calories: 352,
    gpsPoints: [],
  },
  {
    id: "4",
    type: "running",
    startTime: "2024-12-15T07:00:00.000Z",
    endTime: "2024-12-15T07:42:30.000Z",
    durationSeconds: 2550,
    distanceMeters: 7200,
    avgSpeedMps: 2.82,
    avgPaceSecPerKm: 354,
    calories: 248,
    gpsPoints: [],
  },
  {
    id: "5",
    type: "running",
    startTime: "2024-12-10T17:30:00.000Z",
    endTime: "2024-12-10T18:15:45.000Z",
    durationSeconds: 2745,
    distanceMeters: 8000,
    avgSpeedMps: 2.91,
    avgPaceSecPerKm: 343,
    calories: 276,
    gpsPoints: [],
  },
  {
    id: "6",
    type: "running",
    startTime: "2024-12-07T06:00:00.000Z",
    endTime: "2024-12-07T06:21:15.000Z",
    durationSeconds: 1275,
    distanceMeters: 4100,
    avgSpeedMps: 3.22,
    avgPaceSecPerKm: 311,
    calories: 141,
    gpsPoints: [],
  },
  {
    id: "7",
    type: "running",
    startTime: "2024-12-03T18:45:00.000Z",
    endTime: "2024-12-03T19:50:30.000Z",
    durationSeconds: 3930,
    distanceMeters: 12000,
    avgSpeedMps: 3.05,
    avgPaceSecPerKm: 328,
    calories: 414,
    gpsPoints: [],
  },
];

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark } = useTheme();

  const activity = mockActivities.find((a) => a.id === id);

  if (!activity) {
    return (
      <SafeAreaView
        className={`flex-1 ${
          isDark ? "bg-background-dark" : "bg-background-light"
        } items-center justify-center p-8`}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <MaterialIcons
          name="error-outline"
          size={64}
          color={isDark ? "#a6adc8" : "#64748b"}
        />
        <Text
          className={`text-xl mt-4 font-semibold ${
            isDark ? "text-text-primary" : "text-text-dark"
          }`}
        >
          Activity not found
        </Text>
        <TouchableOpacity
          className={`mt-6 px-6 py-3 rounded-full flex-row items-center justify-center shadow-lg active:scale-[0.98] transition-all ${
            isDark ? "bg-primary" : "bg-primary shadow-primary/20"
          }`}
          onPress={() => router.back()}
        >
          <MaterialIcons
            name="arrow-back"
            size={20}
            color={isDark ? "#ffffff" : "#1e293b"}
          />
          <Text
            className={`font-semibold ml-2 ${
              isDark ? "text-background-light" : "text-text-dark"
            }`}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      } p-8`}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Activity Details",
          headerStyle: {
            backgroundColor: isDark ? "#0f0f23" : "#f8fafc",
          },
          headerTintColor: isDark ? "#ffffff" : "#1e293b",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Stats */}
        <View className="py-6">
          <View className="items-center mb-6">
            <Text
              className={`text-sm mb-2 ${
                isDark ? "text-text-secondary" : "text-text-muted"
              }`}
            >
              {formatDateTimeFull(activity.startTime)}
            </Text>
            <View className="flex-row items-baseline">
              <Text
                className={`text-6xl font-bold ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                {formatDistance(activity.distanceMeters)}
              </Text>
              <Text
                className={`text-2xl ml-2 ${
                  isDark ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                km
              </Text>
            </View>
            <View
              className={`mt-4 px-4 py-2 rounded-full ${
                isDark
                  ? "bg-surface-variant-dark"
                  : "bg-surface-light shadow-sm"
              }`}
            >
              <Text
                className={`text-sm font-medium uppercase tracking-wide ${
                  isDark ? "text-primary-dark" : "text-primary"
                }`}
              >
                {activity.type}
              </Text>
            </View>
          </View>

          {/* Key Metrics Card */}
          <View
            className={`rounded-2xl p-4 mb-4 shadow-lg ${
              isDark ? "bg-surface-dark" : "bg-card-light"
            }`}
          >
            <View
              className={`flex-row justify-between items-center py-3 border-b ${
                isDark ? "border-surface-variant-dark" : "border-surface-light"
              }`}
            >
              <View className="flex-row items-center">
                <MaterialIcons
                  name="timer"
                  size={24}
                  color={isDark ? `#00b894` : `#7f27ff`}
                />
                <Text
                  className={`ml-3 font-medium ${
                    isDark ? "text-text-secondary" : "text-text-muted"
                  }`}
                >
                  Duration
                </Text>
              </View>
              <Text
                className={`text-lg font-semibold ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                {formatDuration(activity.durationSeconds)}
              </Text>
            </View>

            <View
              className={`flex-row justify-between items-center py-3 border-b ${
                isDark ? "border-surface-variant-dark" : "border-surface-light"
              }`}
            >
              <View className="flex-row items-center">
                <MaterialIcons
                  name="speed"
                  size={24}
                  color={isDark ? `#00b894` : `#7f27ff`}
                />
                <Text
                  className={`ml-3 font-medium ${
                    isDark ? "text-text-secondary" : "text-text-muted"
                  }`}
                >
                  Avg Pace
                </Text>
              </View>
              <Text
                className={`text-lg font-semibold ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                {formatPace(activity.avgPaceSecPerKm)} /km
              </Text>
            </View>

            <View
              className={`flex-row justify-between items-center py-3 border-b ${
                isDark ? "border-surface-variant-dark" : "border-surface-light"
              }`}
            >
              <View className="flex-row items-center">
                <MaterialIcons
                  name="directions-run"
                  size={24}
                  color={isDark ? `#00b894` : `#7f27ff`}
                />
                <Text
                  className={`ml-3 font-medium ${
                    isDark ? "text-text-secondary" : "text-text-muted"
                  }`}
                >
                  Avg Speed
                </Text>
              </View>
              <Text
                className={`text-lg font-semibold ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                {formatSpeed(activity.avgSpeedMps)} km/h
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-3">
              <View className="flex-row items-center">
                <MaterialIcons
                  name="local-fire-department"
                  size={24}
                  color="#ff6b6b"
                />
                <Text
                  className={`ml-3 font-medium ${
                    isDark ? "text-text-secondary" : "text-text-muted"
                  }`}
                >
                  Calories
                </Text>
              </View>
              <Text
                className={`text-lg font-semibold ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                {activity.calories} kcal
              </Text>
            </View>
          </View>

          {/* Time Information Card */}
          <View
            className={`rounded-2xl p-4 mb-4 shadow-lg ${
              isDark ? "bg-surface-dark" : "bg-card-light"
            }`}
          >
            <Text
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              Time Information
            </Text>

            <View className="flex-row justify-between items-center py-3">
              <Text
                className={`font-medium ${
                  isDark ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                Start Time
              </Text>
              <Text
                className={`font-semibold ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                {new Date(activity.startTime).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-3">
              <Text
                className={`font-medium ${
                  isDark ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                End Time
              </Text>
              <Text
                className={`font-semibold ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                {new Date(activity.endTime).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
            </View>
          </View>

          {/* Map Placeholder Card */}
          <View
            className={`rounded-2xl p-4 mb-4 shadow-lg ${
              isDark ? "bg-surface-dark" : "bg-card-light"
            }`}
          >
            <Text
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              Route
            </Text>
            <View
              className={`rounded-xl h-64 items-center justify-center ${
                isDark
                  ? "bg-surface-variant-dark"
                  : "bg-surface-light shadow-inner"
              }`}
            >
              <MaterialIcons
                name="map"
                size={64}
                color={isDark ? `#00b894` : `#7f27ff`}
              />
              <Text
                className={`mt-4 ${
                  isDark ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                Map view coming soon
              </Text>
              <Text
                className={`text-sm mt-2 ${
                  isDark ? "text-text-disabled" : "text-text-muted"
                }`}
              >
                {activity.gpsPoints.length} GPS points recorded
              </Text>
            </View>
          </View>

          {/* Additional Info Card */}
          <View
            className={`rounded-2xl p-4 shadow-lg ${
              isDark ? "bg-surface-dark" : "bg-card-light"
            }`}
          >
            <Text
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              Additional Information
            </Text>

            <View className="flex-row justify-between items-center py-3">
              <Text
                className={`font-medium ${
                  isDark ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                Activity ID
              </Text>
              <Text
                className={`font-mono font-semibold ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                {activity.id}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-3">
              <Text
                className={`font-medium ${
                  isDark ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                GPS Points
              </Text>
              <Text
                className={`font-semibold ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                {activity.gpsPoints.length}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-3">
              <Text
                className={`font-medium ${
                  isDark ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                Activity Type
              </Text>
              <Text
                className={`font-semibold capitalize ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                {activity.type}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="pb-6 gap-3">
          <TouchableOpacity
            className={`rounded-full py-4 flex-row items-center justify-center shadow-xl active:scale-[0.98] transition-all ${
              isDark
                ? "bg-surface-dark shadow-surface-dark/50 active:bg-surface-variant-dark"
                : "bg-card-light shadow-lg active:bg-surface-light"
            }`}
          >
            <MaterialIcons
              name="share"
              size={20}
              color={isDark ? `#00b894` : `#7f27ff`}
            />
            <Text
              className={`text-base font-semibold ml-2 ${
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              Share Activity
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`rounded-full py-4 flex-row items-center justify-center shadow-xl active:scale-[0.98] transition-all ${
              isDark
                ? "bg-destructive-dark border-destructive-dark active:bg-destructive-hover-dark"
                : "bg-destructive-light border-destructive-light active:bg-destructive-hover-light"
            }`}
          >
            <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
            <Text className={`text-base font-semibold ml-2 text-destructive`}>
              Delete Activity
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
