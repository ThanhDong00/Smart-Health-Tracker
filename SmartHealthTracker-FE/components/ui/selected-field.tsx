import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const SelectedField = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Chọn mục");

  const options = ["React", "Vue", "Angular"];
  return (
    <View className="w-64">
      {/* Button */}
      <Pressable
        className="border border-gray-300 rounded-lg p-3 bg-white"
        onPress={() => setOpen(!open)}
      >
        <Text className="text-gray-800">{value}</Text>
      </Pressable>

      {/* Dropdown */}
      {open && (
        <View className="border border-gray-300 rounded-lg mt-2 bg-white">
          {options.map((item, index) => (
            <Pressable
              key={index}
              className="p-3 border-b border-gray-200 last:border-b-0"
              onPress={() => {
                setValue(item);
                setOpen(false);
              }}
            >
              <Text className="text-gray-700">{item}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default SelectedField;
