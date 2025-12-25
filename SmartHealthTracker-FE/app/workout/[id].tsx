import { Activity } from "@/entity/workout";
import { useTheme } from "@/hooks/useTheme";
import { WorkoutService } from "@/services/workout.service";
import {
  formatDateTimeFull,
  formatDistance,
  formatDuration,
  formatPace,
  formatSpeed,
} from "@/utils/formatters";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Map backend workout response to Activity interface
const mapWorkoutToActivity = (workout: any): Activity => ({
  id: workout.id.toString(),
  type: workout.type.toLowerCase(),
  startTime: workout.startTime,
  endTime: workout.endTime,
  durationSeconds: workout.durationSeconds,
  distanceMeters: workout.distanceMeters,
  avgSpeedMps: workout.avgSpeedMps,
  avgPaceSecPerKm: workout.avgPaceSecPerKm,
  calories: workout.calories,
  gpsPoints: workout.gpsPoints || [],
});

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark } = useTheme();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  // Fetch workout detail
  const fetchWorkout = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setError(null);

      const response = await WorkoutService.getWorkoutById(id as string);
      const mappedActivity = mapWorkoutToActivity(response);
      setActivity(mappedActivity);
    } catch (error: any) {
      console.error("Error fetching workout:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to load workout";
      setError(errorMessage);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    } finally {
      if (showLoading) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkout();
  }, [id]);

  // Handle pull to refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchWorkout(false);
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    Alert.alert(
      "Delete Activity",
      "Are you sure you want to delete this activity?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Toast.show({
              type: "info",
              text1: "Not Available",
              text2: "This feature is not available yet",
            });
          },
        },
      ]
    );
  };

  // Handle share action
  const handleSharePress = () => {
    Toast.show({
      type: "info",
      text1: "Not Available",
      text2: "This feature is not available yet",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView
        className={`flex-1 ${
          isDark ? "bg-background-dark" : "bg-background-light"
        } items-center justify-center`}
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
        <ActivityIndicator
          size="large"
          color={isDark ? "#00b894" : "#7f27ff"}
        />
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !activity) {
    return (
      <SafeAreaView
        className={`flex-1 ${
          isDark ? "bg-background-dark" : "bg-background-light"
        } items-center justify-center p-8`}
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
          {error || "Activity not found"}
        </Text>
        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            className={`px-6 py-3 rounded-full flex-row items-center justify-center shadow-lg active:scale-[0.98] ${
              isDark ? "bg-primary" : "bg-primary shadow-primary/20"
            }`}
            onPress={() => fetchWorkout()}
          >
            <MaterialIcons name="refresh" size={20} color="#ffffff" />
            <Text className="font-semibold ml-2 text-background-light">
              Retry
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-3 rounded-full flex-row items-center justify-center shadow-lg active:scale-[0.98] ${
              isDark
                ? "bg-surface-dark"
                : "bg-card-light shadow-surface-light/20"
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
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
        <Toast />
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? "#00b894" : "#7f27ff"}
          />
        }
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

          {/* Map Card */}
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
            {activity.gpsPoints.length > 0 ? (
              <View className="rounded-xl overflow-hidden h-64">
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: activity.gpsPoints[0].latitude,
                    longitude: activity.gpsPoints[0].longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  mapType="standard"
                  showsUserLocation={false}
                  showsMyLocationButton={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                  onMapReady={() => {
                    // Fit to coordinates after map is ready
                    const coordinates = activity.gpsPoints.map((point) => ({
                      latitude: point.latitude,
                      longitude: point.longitude,
                    }));
                    if (coordinates.length > 0 && mapRef.current) {
                      setTimeout(() => {
                        mapRef.current?.fitToCoordinates(coordinates, {
                          edgePadding: {
                            top: 50,
                            right: 50,
                            bottom: 50,
                            left: 50,
                          },
                          animated: true,
                        });
                      }, 100);
                    }
                  }}
                >
                  <Polyline
                    coordinates={activity.gpsPoints.map((point) => ({
                      latitude: point.latitude,
                      longitude: point.longitude,
                    }))}
                    strokeColor={isDark ? "#00b894" : "#7f27ff"}
                    strokeWidth={8}
                  />
                </MapView>
              </View>
            ) : (
              <View
                className={`rounded-xl h-64 items-center justify-center ${
                  isDark
                    ? "bg-surface-variant-dark"
                    : "bg-surface-light shadow-inner"
                }`}
              >
                <MaterialIcons
                  name="location-off"
                  size={64}
                  color={isDark ? "#a6adc8" : "#64748b"}
                />
                <Text
                  className={`mt-4 ${
                    isDark ? "text-text-secondary" : "text-text-muted"
                  }`}
                >
                  No GPS data recorded
                </Text>
              </View>
            )}
            <Text
              className={`text-sm mt-2 text-center ${
                isDark ? "text-text-disabled" : "text-text-muted"
              }`}
            >
              {activity.gpsPoints.length} GPS points recorded
            </Text>
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
        <View className="pb-6 gap-4">
          <TouchableOpacity
            className={`rounded-full py-4 flex-row items-center justify-center shadow-xl active:scale-[0.98] transition-all ${
              isDark
                ? "bg-surface-dark shadow-surface-dark/50 active:bg-surface-variant-dark"
                : "bg-card-light shadow-lg active:bg-surface-light"
            }`}
            onPress={handleSharePress}
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
            onPress={handleDelete}
          >
            <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
            <Text className={`text-base font-semibold ml-2 text-destructive`}>
              Delete Activity
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}
