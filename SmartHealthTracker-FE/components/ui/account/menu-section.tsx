import { View } from "react-native";

export default function MenuSection({
  children,
  isDark,
}: {
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <View
      className={`rounded-2xl overflow-hidden ${
        isDark ? "bg-surface-dark shadow-lg" : "bg-card-light shadow-md"
      }`}
    >
      {children}
    </View>
  );
}
