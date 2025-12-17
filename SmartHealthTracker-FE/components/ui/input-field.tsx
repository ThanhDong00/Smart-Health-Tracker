import { ReactNode } from "react";
import { Text, TextInput, View } from "react-native";

const InputField = ({
  label,
  headIcon,
  trailingIcon,
  placeholder,
  value,
  isDisabled = false,
}: {
  label: string;
  headIcon?: ReactNode;
  trailingIcon?: ReactNode;
  placeholder?: string;
  value?: string;
  isDisabled?: boolean;
}) => {
  return (
    <View>
      <Text className="text-sm font-semibold mb-1 ml-1"> {label} </Text>
      <View className="flex-row items-center gap-3 bg-light_inputBackground dark:bg-dark_inputBackground rounded-lg px-4 h-12 border border-gray-300">
        {headIcon}
        <TextInput
          className="flex-1"
          placeholder={placeholder}
          value={value}
          editable={!isDisabled}
        ></TextInput>
        {trailingIcon}
      </View>
    </View>
  );
};

export default InputField;
