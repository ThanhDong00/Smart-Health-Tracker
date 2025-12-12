import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TextInput, View } from "react-native";

const PasswordInput = ({
  label,
  value,
  onChangeText,
  visible,
  onToggle,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
}) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-1">{label}</Text>
      <View className="flex-row items-center bg-light_inputBackground dark:bg-dark_inputBackground rounded-lg px-4">
        <TextInput
          className="flex-1 py-3 pr-3 text-base"
          secureTextEntry={!visible}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
        />
        <MaterialCommunityIcons
          name={visible ? "eye-off" : "eye"}
          size={24}
          color="#6b7280"
          onPress={onToggle}
          style={{ marginLeft: 10 }}
        />
      </View>
    </View>
  );
};

export default PasswordInput;
