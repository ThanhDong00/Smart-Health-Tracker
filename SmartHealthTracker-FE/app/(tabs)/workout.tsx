import WorkoutActivityCard from "@/components/ui/workout-activity-card";
import WorkoutCalendar from "@/components/ui/workout-calendar";
import WorkoutStatCard from "@/components/ui/workout-stat-card";
import { formatDistance, formatPace, getDateString } from "@/utils/formatters";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
interface GpsPoint {
  sequenceIndex: number;
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: string;
}

interface Activity {
  id: string;
  type: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  distanceMeters: number;
  avgSpeedMps: number;
  avgPaceSecPerKm: number;
  calories: number;
  gpsPoints: GpsPoint[];
}

// Mock data - 7 activities in December 2025
const mockActivities: Activity[] = [
  {
    id: "1",
    type: "running",
    startTime: "2025-12-24T01:30:00.000Z",
    endTime: "2025-12-24T02:58:10.000Z",
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
    startTime: "2025-11-22T01:00:00.000Z",
    endTime: "2025-11-22T01:18:45.000Z",
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
    startTime: "2025-12-17T01:15:00.000Z",
    endTime: "2025-12-17T02:13:20.000Z",
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
    startTime: "2025-12-15T00:00:00.000Z",
    endTime: "2025-12-15T00:42:30.000Z",
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
    startTime: "2025-12-10T00:30:00.000Z",
    endTime: "2025-12-10T01:15:45.000Z",
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
    startTime: "2025-12-07T23:00:00.000Z",
    endTime: "2025-12-07T23:21:15.000Z",
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
    startTime: "2025-12-03T01:45:00.000Z",
    endTime: "2025-12-03T02:50:30.000Z",
    durationSeconds: 3930,
    distanceMeters: 12000,
    avgSpeedMps: 3.05,
    avgPaceSecPerKm: 328,
    calories: 414,
    gpsPoints: [],
  },
];

export default function WorkoutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme(); // Detect system theme
  const isDark = colorScheme === "dark";

  // Default to Dec 24, 2025 (a day with activity)
  const [selectedDate, setSelectedDate] = useState(getDateString(new Date()));
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Memoized activities with dates
  const activitiesWithDates = useMemo(
    () =>
      mockActivities.map((a) => ({
        ...a,
        dateString: getDateString(new Date(a.startTime)),
      })),
    []
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
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      } p-8`}
      edges={["top"]}
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
            backgroundColor: isDark ? "#1a1a1a" : "#f8fafc",
          },
          headerTintColor: isDark ? "#ffffff" : "#1e293b",
        }}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Calendar */}
        <WorkoutCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onMonthChange={setCurrentMonth}
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
    </SafeAreaView>
  );
}
