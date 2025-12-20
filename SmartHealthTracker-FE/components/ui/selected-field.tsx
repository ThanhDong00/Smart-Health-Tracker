import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";

type SelectedFieldProps = {
  headIcon?: ReactNode;
  trailingIcon?: ReactNode;
  label: string;
  options: string[];
  value?: string;
  onChangeValue: (value: string) => void;
  isDisabled?: boolean;
  isDark?: boolean;
};

const SelectedField = ({
  headIcon,
  label,
  options,
  value = "Select an option",
  onChangeValue,
  isDisabled = false,
  isDark = false,
}: SelectedFieldProps) => {
  const [open, setOpen] = useState(false);

  return (
    <View className="w-full">
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
      {/* Button */}
      <Pressable
        className={`flex-row items-center gap-3 rounded-lg px-4 h-12 border ${
          isDisabled
            ? isDark
              ? "bg-surface-variant-dark border-surface-variant-hover-dark opacity-60"
              : "bg-gray-100 border-gray-200 opacity-60"
            : isDark
            ? "bg-surface-dark border-surface-variant-dark"
            : "bg-card-light border-gray-300"
        }`}
        onPress={() => setOpen(!open)}
        disabled={isDisabled}
      >
        {headIcon}
        <Text
          className={`flex-1 ${
            isDisabled
              ? isDark
                ? "text-text-disabled"
                : "text-gray-500"
              : isDark
              ? "text-text-primary"
              : "text-text-dark"
          }`}
        >
          {value}
        </Text>
        {open ? (
          <MaterialIcons
            name="keyboard-arrow-up"
            size={24}
            color={isDark ? "#a6adc8" : "#64748b"}
          />
        ) : (
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={isDark ? "#a6adc8" : "#64748b"}
          />
        )}
      </Pressable>

      {/* Dropdown */}
      {open && (
        <View
          className={`border rounded-lg ${
            isDark
              ? "border-surface-variant-dark bg-surface-dark"
              : "border-gray-300 bg-white"
          }`}
        >
          {options.map((item, index) => (
            <Pressable
              key={index}
              className={`p-3 border-b ${
                isDark ? "border-surface-variant-dark" : "border-gray-200"
              } last:border-b-0`}
              onPress={() => {
                setOpen(false);
                onChangeValue(item);
              }}
            >
              <Text
                className={isDark ? "text-text-primary" : "text-text-dark"}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default SelectedField;
