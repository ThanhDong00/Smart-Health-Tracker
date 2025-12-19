// app/activity/[id].tsx
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

const formatDistance = (meters: number): string => {
  return (meters / 1000).toFixed(1);
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const formatPace = (secPerKm: number): string => {
  const minutes = Math.floor(secPerKm / 60);
  const seconds = Math.floor(secPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const formatSpeed = (mps: number): string => {
  return ((mps * 3600) / 1000).toFixed(1);
};

const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const activity = mockActivities.find((a) => a.id === id);

  if (!activity) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <MaterialIcons name="error-outline" size={64} color="#4a4a4a" />
        <Text className="text-white text-xl mt-4">Activity not found</Text>
        <TouchableOpacity
          className="mt-6 bg-[#00d4aa] px-6 py-3 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-black font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#1a1a1a]">
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Activity Details",
          headerStyle: {
            backgroundColor: "#1a1a1a",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1">
        {/* Main Stats */}
        <View className="px-4 py-6">
          <View className="items-center mb-6">
            <Text className="text-gray-400 text-sm mb-2">
              {formatDateTime(activity.startTime)}
            </Text>
            <View className="flex-row items-baseline">
              <Text className="text-white text-6xl font-bold">
                {formatDistance(activity.distanceMeters)}
              </Text>
              <Text className="text-gray-400 text-2xl ml-2">km</Text>
            </View>
            <View className="bg-[#252525] mt-4 px-4 py-2 rounded-full">
              <Text className="text-[#00d4aa] text-sm font-medium uppercase">
                {activity.type}
              </Text>
            </View>
          </View>

          {/* Key Metrics */}
          <View className="bg-[#252525] rounded-2xl p-4 mb-4">
            <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
              <View className="flex-row items-center">
                <MaterialIcons name="timer" size={24} color="#00d4aa" />
                <Text className="text-gray-400 ml-3">Duration</Text>
              </View>
              <Text className="text-white text-lg font-semibold">
                {formatDuration(activity.durationSeconds)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
              <View className="flex-row items-center">
                <MaterialIcons name="speed" size={24} color="#00d4aa" />
                <Text className="text-gray-400 ml-3">Avg Pace</Text>
              </View>
              <Text className="text-white text-lg font-semibold">
                {formatPace(activity.avgPaceSecPerKm)} /km
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
              <View className="flex-row items-center">
                <MaterialIcons
                  name="directions-run"
                  size={24}
                  color="#00d4aa"
                />
                <Text className="text-gray-400 ml-3">Avg Speed</Text>
              </View>
              <Text className="text-white text-lg font-semibold">
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
                <Text className="text-gray-400 ml-3">Calories</Text>
              </View>
              <Text className="text-white text-lg font-semibold">
                {activity.calories} kcal
              </Text>
            </View>
          </View>

          {/* Time Information */}
          <View className="bg-[#252525] rounded-2xl p-4 mb-4">
            <Text className="text-white text-lg font-semibold mb-3">
              Time Information
            </Text>

            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-400">Start Time</Text>
              <Text className="text-white">
                {new Date(activity.startTime).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-400">End Time</Text>
              <Text className="text-white">
                {new Date(activity.endTime).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
            </View>
          </View>

          {/* Map Placeholder */}
          <View className="bg-[#252525] rounded-2xl p-4 mb-4">
            <Text className="text-white text-lg font-semibold mb-3">Route</Text>
            <View className="bg-[#3a4a3a] rounded-xl h-64 items-center justify-center">
              <MaterialIcons name="map" size={64} color="#00d4aa" />
              <Text className="text-gray-400 mt-4">Map view coming soon</Text>
              <Text className="text-gray-500 text-sm mt-2">
                {activity.gpsPoints.length} GPS points recorded
              </Text>
            </View>
          </View>

          {/* Additional Info */}
          <View className="bg-[#252525] rounded-2xl p-4">
            <Text className="text-white text-lg font-semibold mb-3">
              Additional Information
            </Text>

            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-400">Activity ID</Text>
              <Text className="text-white font-mono">{activity.id}</Text>
            </View>

            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-400">GPS Points</Text>
              <Text className="text-white">{activity.gpsPoints.length}</Text>
            </View>

            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-400">Activity Type</Text>
              <Text className="text-white capitalize">{activity.type}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-4 pb-6 gap-3">
          <TouchableOpacity className="bg-[#252525] rounded-full py-4 flex-row items-center justify-center">
            <MaterialIcons name="share" size={20} color="white" />
            <Text className="text-white text-base font-semibold ml-2">
              Share Activity
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-red-500/20 border border-red-500 rounded-full py-4 flex-row items-center justify-center">
            <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
            <Text className="text-red-500 text-base font-semibold ml-2">
              Delete Activity
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
