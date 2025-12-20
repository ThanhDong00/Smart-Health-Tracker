import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Text, TextInput, View } from "react-native";

const PasswordInput = ({
  label,
  value,
  onChangeText,
  visible,
  onToggle,
  placeholder,
  isDark = false,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
  isDark?: boolean;
}) => {
  return (
    <View className="">
      <Text
        className={`text-sm font-semibold mb-1 ml-1 ${
          isDark ? "text-text-primary" : "text-text-dark"
        }`}
      >
        {label}
      </Text>
      <View
        className={`flex-row items-center gap-3 rounded-lg px-4 h-12 border ${
          isDark
            ? "bg-surface-dark border-surface-variant-dark"
            : "bg-card-light border-gray-300"
        }`}
      >
        <MaterialIcons
          name="lock"
          size={24}
          color={isDark ? "#00b894" : "#7f27ff"}
        />

        <TextInput
          className={`flex-1 ${
            isDark ? "text-text-primary" : "text-text-dark"
          }`}
          secureTextEntry={!visible}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#45475a" : "#9ca3af"}
          autoCapitalize="none"
        />
        <MaterialCommunityIcons
          name={visible ? "eye-off" : "eye"}
          size={24}
          color={isDark ? "#a6adc8" : "#64748b"}
          onPress={onToggle}
        />
      </View>
    </View>
  );
};

export default PasswordInput;
