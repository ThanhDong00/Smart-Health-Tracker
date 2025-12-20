import { ReactNode } from "react";
import { Text, TextInput, View } from "react-native";

type InputFieldProps = {
  label: string;
  headIcon?: ReactNode;
  trailingIcon?: ReactNode;
  placeholder?: string;
  value?: string;
  isDisabled?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  onChange?: (text: string) => void;
  isDark?: boolean;
};

const InputField = ({
  label,
  headIcon,
  trailingIcon,
  placeholder,
  value,
  isDisabled = false,
  keyboardType = "default",
  onChange,
  isDark = false,
}: InputFieldProps) => {
  const isNumeric = keyboardType === "numeric";

  return (
    <View>
      <Text
        className={`text-sm font-semibold mb-1 ml-1 ${
          isDisabled
            ? isDark
              ? "text-text-disabled"
              : "text-gray-400"
            : isDark
            ? "text-text-primary"
            : "text-text-dark"
        }`}
      >
        {" "}
        {label}{" "}
      </Text>
      <View
        className={`flex-row items-center gap-3 rounded-lg px-4 h-12 border ${
          isDisabled
            ? isDark
              ? "bg-surface-variant-dark border-surface-variant-hover-dark opacity-60"
              : "bg-gray-100 border-gray-200 opacity-60"
            : isDark
            ? "bg-surface-dark border-surface-variant-dark"
            : "bg-card-light border-gray-300"
        }`}
      >
        {headIcon}
        <TextInput
          className={`flex-1 ${
            isDisabled
              ? isDark
                ? "text-text-disabled"
                : "text-gray-500"
              : isDark
              ? "text-text-primary"
              : "text-text-dark"
          }`}
          keyboardType={keyboardType}
          inputMode={isNumeric ? "numeric" : "text"}
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#45475a" : "#9ca3af"}
          value={value}
          editable={!isDisabled}
          onChangeText={onChange}
        ></TextInput>
        {trailingIcon}
      </View>
    </View>
  );
};

export default InputField;
