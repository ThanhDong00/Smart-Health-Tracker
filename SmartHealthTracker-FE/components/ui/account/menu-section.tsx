import { View } from "react-native";

export default function MenuSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View className="bg-cardBackground rounded-xl overflow-hidden shadow-sm mb-4">
      {children}
    </View>
  );
}
