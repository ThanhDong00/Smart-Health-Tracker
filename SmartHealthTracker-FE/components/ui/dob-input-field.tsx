import { ReactNode, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type DobInputFieldProps = {
  headIcon?: ReactNode;
  label: string;
  value?: Date;
  onChange?: (data: Date) => void;
  isDisabled?: boolean;
};

const DobInputField = ({
  label,
  headIcon,
  value,
  onChange,
  isDisabled = false,
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
        className={`text-sm font-semibold mb-1 ml-1 ${isDisabled ? "text-gray-400" : ""}`}
      >
        {" "}
        {label}{" "}
      </Text>
      <Pressable onPress={() => setIsVisible(true)} disabled={isDisabled}>
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
