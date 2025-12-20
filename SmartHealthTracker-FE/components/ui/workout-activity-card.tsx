import {
  formatDateTime,
  formatDistance,
  formatDuration,
  formatPace,
  getDayLabel,
} from "@/utils/formatters";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

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
}

interface WorkoutActivityCardProps {
  activity: Activity;
  isDark: boolean;
  onPress: () => void;
}

export default function WorkoutActivityCard({
  activity,
  isDark,
  onPress,
}: WorkoutActivityCardProps) {
  const { date, time } = formatDateTime(activity.startTime);
  const dayLabel = getDayLabel(activity.startTime);

  return (
    <TouchableOpacity
      className={`rounded-2xl overflow-hidden mb-3 ${
        isDark ? "bg-surface-dark" : "bg-card-light shadow-sm"
      }`}
      onPress={onPress}
    >
      <View className="p-4">
        <View className="flex-row items-baseline mb-2">
          <Text
            className={`text-2xl font-bold ${
              isDark ? "text-text-primary" : "text-text-dark"
            }`}
          >
            {formatDistance(activity.distanceMeters)}
          </Text>
          <Text
            className={`text-sm ml-1 ${
              isDark ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            km
          </Text>
          <View
            className={`ml-auto px-2 py-1 rounded ${
              isDark ? "bg-surface-variant-dark" : "bg-surface-light"
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              {dayLabel}
            </Text>
          </View>
        </View>

        <Text
          className={`text-xs mb-3 ${
            isDark ? "text-text-secondary" : "text-text-muted"
          }`}
        >
          {date} • {time}
        </Text>

        <View className="flex-row gap-4 mb-2">
          <View className="flex-row items-center">
            <MaterialIcons
              name="timer"
              size={14}
              color={isDark ? `#00b894` : `#7f27ff`}
            />
            <Text
              className={`text-sm ml-1 ${
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              {formatDuration(activity.durationSeconds)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons
              name="speed"
              size={14}
              color={isDark ? `#00b894` : `#7f27ff`}
            />
            <Text
              className={`text-sm ml-1 ${
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              {formatPace(activity.avgPaceSecPerKm)}
              <Text
                className={`${
                  isDark ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                {" "}
                /km
              </Text>
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <MaterialIcons
            name="local-fire-department"
            size={14}
            color="#ff6b6b"
          />
          <Text
            className={`text-sm ml-1 ${
              isDark ? "text-text-primary" : "text-text-dark"
            }`}
          >
            {activity.calories}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
