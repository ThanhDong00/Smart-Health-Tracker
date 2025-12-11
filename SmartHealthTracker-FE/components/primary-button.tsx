import { Text, TouchableOpacity, useColorScheme } from "react-native";

export default function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme() ?? "light";
  return (
    <TouchableOpacity
      className="bg-primary w-full px-4 py-4 rounded-lg items-center"
      onPress={onPress}
    >
      <Text className="text-white font-bold text-xl">{title}</Text>
    </TouchableOpacity>
  );
}
