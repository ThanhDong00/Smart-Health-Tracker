import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

export default function SettingItem({
  children,
  label,
  onPress,
  isDark,
  isDestructive = false,
}: {
  children?: React.ReactNode;
  label: string;
  onPress: () => void;
  isDark: boolean;
  isDestructive?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between px-4 py-3 min-h-[56px] border-b ${
        isDark
          ? "bg-surface-dark border-surface-variant-dark"
          : "bg-card-light border-surface-light"
      }`}
    >
      <View className="flex-row items-center gap-4">
        {children}
        <Text
          className={`text-base ${
            isDestructive
              ? "text-destructive"
              : isDark
              ? "text-text-primary"
              : "text-text-dark"
          }`}
        >
          {label}
        </Text>
      </View>

      <MaterialIcons
        name="chevron-right"
        size={24}
        color={isDark ? "#a6adc8" : "#64748b"}
      />
    </TouchableOpacity>
  );
}
