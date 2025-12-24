import WorkoutActivityCard from "@/components/ui/workout-activity-card";
import WorkoutCalendar from "@/components/ui/workout-calendar";
import WorkoutStatCard from "@/components/ui/workout-stat-card";
import { Activity } from "@/entity/workout";
import { useTheme } from "@/hooks/useTheme";
import { WorkoutService } from "@/services/workout.service";
import { formatDistance, formatPace, getDateString } from "@/utils/formatters";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

export default function WorkoutScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [selectedDate, setSelectedDate] = useState(getDateString(new Date()));
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch workouts from API
  const fetchWorkouts = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setIsLoading(true);

        // Get first and last day of current month
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Format dates as yyyy-MM-dd
        const fromDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
        const toDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;

        const response = await WorkoutService.getWorkouts(fromDate, toDate);

        if (Array.isArray(response)) {
          const mappedActivities = response.map(mapWorkoutToActivity);
          setActivities(mappedActivities);
        } else {
          setActivities([]);
        }
      } catch (error: any) {
        console.error("Error fetching workouts:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error?.response?.data?.message || "Failed to load workouts",
        });
        setActivities([]);
      } finally {
        if (showLoading) setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [currentMonth]
  );

  // Fetch workouts on mount and when month changes
  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // Handle pull to refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchWorkouts(false);
  };

  // Handle month change
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  // Memoized activities with dates
  const activitiesWithDates = useMemo(
    () =>
      activities.map((a) => ({
        ...a,
        dateString: getDateString(new Date(a.startTime)),
      })),
    [activities]
  );

  const datesWithActivities = useMemo(
    () => [...new Set(activitiesWithDates.map((a) => a.dateString))],
    [activitiesWithDates]
  );

  // Calculate monthly stats
  const monthActivities = useMemo(
    () =>
      activitiesWithDates.filter((a) => {
        const activityDate = new Date(a.startTime);
        return (
          activityDate.getFullYear() === currentMonth.getFullYear() &&
          activityDate.getMonth() === currentMonth.getMonth()
        );
      }),
    [activitiesWithDates, currentMonth]
  );

  const totalDistance = useMemo(
    () => monthActivities.reduce((sum, a) => sum + a.distanceMeters, 0),
    [monthActivities]
  );

  const bestPace = useMemo(
    () =>
      monthActivities.length > 0
        ? Math.min(...monthActivities.map((a) => a.avgPaceSecPerKm))
        : 0,
    [monthActivities]
  );

  const totalRuns = monthActivities.length;

  const selectedDateActivities = activitiesWithDates.filter(
    (a) => a.dateString === selectedDate
  );

  return (
    <View
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      } px-8 pt-4`}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Run History",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: isDark ? "#0f0f23" : "#f8fafc",
          },
          headerTintColor: isDark ? "#ffffff" : "#1e293b",
        }}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? "#00b894" : "#7f27ff"}
          />
        }
      >
        {isLoading ? (
          <View className="py-20 items-center">
            <ActivityIndicator
              size="large"
              color={isDark ? "#00b894" : "#7f27ff"}
            />
          </View>
        ) : (
          <>
            {/* Calendar */}
            <WorkoutCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onMonthChange={handleMonthChange}
              currentMonth={currentMonth}
              datesWithActivities={datesWithActivities}
              isDark={isDark}
            />

            {/* Stats Cards */}
            <View className="mb-6 flex-row gap-3">
              <WorkoutStatCard
                icon="directions-run"
                label={`TOTAL (${currentMonth
                  .toLocaleDateString("en-US", { month: "short" })
                  .toUpperCase()})`}
                value={formatDistance(totalDistance)}
                unit="km"
                isDark={isDark}
              />
              <WorkoutStatCard
                icon="speed"
                label="BEST PACE"
                value={bestPace > 0 ? formatPace(bestPace) : "0:00"}
                unit="/km"
                isDark={isDark}
              />
              <WorkoutStatCard
                icon="local-fire-department"
                label="RUNS"
                value={totalRuns.toString()}
                isDark={isDark}
              />
            </View>

            {/* Detail Runs */}
            <View className="pb-6">
              <Text
                className={`text-xs mb-4 font-medium ${
                  isDark ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                DETAILS RUNS
              </Text>
              {selectedDateActivities.length > 0 ? (
                selectedDateActivities.map((activity) => (
                  <WorkoutActivityCard
                    key={activity.id}
                    activity={activity}
                    isDark={isDark}
                    onPress={() => router.push(`/workout/${activity.id}`)}
                  />
                ))
              ) : (
                <View
                  className={`rounded-2xl p-6 ${
                    isDark ? "bg-surface-dark" : "bg-card-light shadow-sm"
                  }`}
                >
                  <Text
                    className={`text-center text-sm ${
                      isDark ? "text-text-secondary" : "text-text-muted"
                    }`}
                  >
                    No runs on this day
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Fixed Start Run Button */}
      <View
        className={`px-4 pb-6 pt-2 ${
          isDark ? "bg-background-dark" : "bg-background-light"
        }`}
      >
        <TouchableOpacity
          className="bg-primary rounded-full py-4 flex-row items-center justify-center shadow-2xl active:shadow-lg transition-all"
          onPress={() => router.push("/workout/live-tracking")}
        >
          <MaterialIcons name="play-arrow" size={24} color="#ffffff" />
          <Text className="text-background-light text-lg font-bold ml-2">
            Start Run
          </Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
}
