import { Text, TouchableOpacity, useColorScheme } from "react-native";

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const colorScheme = useColorScheme() ?? "light";
  return (
    <TouchableOpacity
      className="bg-primary w-full px-4 py-4 rounded-lg items-center"
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-white font-bold text-xl">{title}</Text>
    </TouchableOpacity>
  );
}
