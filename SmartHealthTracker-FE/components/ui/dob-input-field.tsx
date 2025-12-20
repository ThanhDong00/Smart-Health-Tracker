import { ReactNode, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type DobInputFieldProps = {
  headIcon?: ReactNode;
  label: string;
  value?: Date;
  onChange?: (data: Date) => void;
  isDisabled?: boolean;
  isDark?: boolean;
};

const DobInputField = ({
  label,
  headIcon,
  value,
  onChange,
  isDisabled = false,
  isDark = false,
}: DobInputFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleConfirm = (date: Date) => {
    onChange?.(date);
    setIsVisible(false);
  };

  const selectedDate = value;
  const selectedDateString = selectedDate
    ? selectedDate.toLocaleDateString()
    : "";

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
      <Pressable onPress={() => setIsVisible(true)} disabled={isDisabled}>
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
            editable={false}
            pointerEvents="none"
            value={selectedDateString}
          />
        </View>
      </Pressable>

      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        date={selectedDate ?? new Date()}
        maximumDate={new Date()}
        onConfirm={handleConfirm}
        onCancel={() => setIsVisible(false)}
      />
    </View>
  );
};

export default DobInputField;
