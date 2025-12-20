import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PropsWithChildren } from "react";
import { Text, View } from "react-native";

export function CardCollapsible({
  children,
  title,
  subtitle,
  icon = "home",
  isDark,
}: PropsWithChildren & {
  title: string;
  subtitle: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  isDark: boolean;
}) {
  return (
    <View
      className={`rounded-2xl p-4 ${
        isDark ? "bg-surface-dark shadow-lg" : "bg-card-light shadow-md"
      }`}
    >
      <View className="flex-row items-center gap-4">
        <MaterialIcons
          name={icon}
          size={32}
          color={isDark ? `#00b894` : `#7f27ff`}
        />
        <View className="flex-1">
          <Text
            className={`text-lg font-semibold ${
              isDark ? "text-text-primary" : "text-text-dark"
            }`}
          >
            {title}
          </Text>
          <Text
            className={`text-sm ${
              isDark ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {children && <View className="mt-4">{children}</View>}
    </View>
  );
}
