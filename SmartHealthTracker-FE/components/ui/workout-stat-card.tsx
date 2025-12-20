import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

interface WorkoutStatCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string | number;
  unit?: string;
  isDark: boolean;
}

export default function WorkoutStatCard({
  icon,
  label,
  value,
  unit,
  isDark,
}: WorkoutStatCardProps) {
  return (
    <View
      className={`flex-1 rounded-2xl p-4 ${
        isDark ? "bg-surface-dark shadow-sm" : "bg-card-light shadow-md"
      }`}
    >
      <MaterialIcons
        name={icon}
        size={20}
        color={isDark ? `#00b894` : `#7f27ff`}
      />
      <Text
        className={`text-xs mt-2 font-medium ${
          isDark ? "text-text-secondary" : "text-text-muted"
        }`}
      >
        {label}
      </Text>
      <Text
        className={`text-2xl font-bold ${
          isDark ? "text-text-primary" : "text-text-dark"
        }`}
      >
        {value}
        {unit && (
          <Text
            className={`text-base font-normal ${
              isDark ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            {" "}
            {unit}
          </Text>
        )}
      </Text>
    </View>
  );
}
