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
}: InputFieldProps) => {
  const isNumeric = keyboardType === "numeric";

  return (
    <View>
      <Text
        className={`text-sm font-semibold mb-1 ml-1 ${isDisabled ? "text-gray-400" : ""}`}
      >
        {" "}
        {label}{" "}
      </Text>
      <View
        className={`flex-row items-center gap-3 rounded-lg px-4 h-12 border ${
          isDisabled
            ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60"
            : "bg-light_inputBackground dark:bg-dark_inputBackground border-gray-300"
        }`}
      >
        {headIcon}
        <TextInput
          className={`flex-1 ${isDisabled ? "text-gray-500" : ""}`}
          keyboardType={keyboardType}
          inputMode={isNumeric ? "numeric" : "text"}
          placeholder={placeholder}
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
