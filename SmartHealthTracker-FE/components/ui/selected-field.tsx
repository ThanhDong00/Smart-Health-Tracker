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
};

const SelectedField = ({
  headIcon,
  label,
  options,
  value = "Select an option",
  onChangeValue,
  isDisabled = false,
}: SelectedFieldProps) => {
  const [open, setOpen] = useState(false);

  return (
    <View className="w-full">
      <Text
        className={`text-sm font-semibold mb-1 ml-1 ${isDisabled ? "text-gray-400" : ""}`}
      >
        {" "}
        {label}{" "}
      </Text>
      {/* Button */}
      <Pressable
        className={`flex-row items-center gap-3 rounded-lg px-4 h-12 border ${
          isDisabled
            ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60"
            : "bg-light_inputBackground dark:bg-dark_inputBackground border-gray-300"
        }`}
        onPress={() => setOpen(!open)}
        disabled={isDisabled}
      >
        {headIcon}
        <Text className={`flex-1 ${isDisabled ? "text-gray-500" : ""}`}>
          {value}
        </Text>
        {open ? (
          <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
        ) : (
          <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
        )}
      </Pressable>

      {/* Dropdown */}
      {open && (
        <View className="border border-gray-300 rounded-lg bg-white">
          {options.map((item, index) => (
            <Pressable
              key={index}
              className="p-3 border-b border-gray-200 last:border-b-0"
              onPress={() => {
                setOpen(false);
                onChangeValue(item);
              }}
            >
              <Text className="">{item}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default SelectedField;
