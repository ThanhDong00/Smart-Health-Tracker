import { Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../icon-symbol";

export default function SettingItem({
  children,
  label,
  color,
  onPress,
}: {
  children?: React.ReactNode;
  label: string;
  color?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between px-4 py-3 min-h-[56px] bg-white border-b border-neutral-200"
    >
      <View className=" flex-row items-center gap-4">
        {children}
        <Text className="">{label}</Text>
      </View>

      <IconSymbol name="chevron.right" size={24} color="#000" />
    </TouchableOpacity>
  );
}
