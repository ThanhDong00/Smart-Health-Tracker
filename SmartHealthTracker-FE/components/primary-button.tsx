import { Text, TouchableOpacity } from "react-native";

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  isDark = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isDark?: boolean;
}) {
  return (
    <TouchableOpacity
      className={`w-full px-4 py-4 rounded-lg items-center ${
        disabled
          ? isDark
            ? "bg-surface-variant-dark"
            : "bg-gray-300"
          : "bg-primary"
      }`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        className={`font-bold text-xl ${
          disabled
            ? isDark
              ? "text-text-disabled"
              : "text-gray-500"
            : "text-white"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
