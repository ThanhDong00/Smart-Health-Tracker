import { Text, TouchableOpacity } from "react-native";

export default function SecondaryButton({
  title,
  onPress,
  isDark = false,
}: {
  title: string;
  onPress: () => void;
  isDark?: boolean;
}) {
  return (
    <TouchableOpacity
      className="bg-secondary w-full px-4 py-4 rounded-lg items-center"
      onPress={onPress}
    >
      <Text className="text-white font-bold text-xl">{title}</Text>
    </TouchableOpacity>
  );
}
