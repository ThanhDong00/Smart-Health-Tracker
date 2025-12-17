import InputField from "@/components/ui/input-field";
import SelectedField from "@/components/ui/selected-field";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AvatarSection = ({ onEdit }: { onEdit: () => void }) => {
  return (
    <View className="flex-col items-center justify-center pt-2 pb-8">
      <View className="relative">
        <View className="w-28 h-28 rounded-full bg-[#ffccaa] items-center justify-center overflow-hidden border-4 border-background-dark shadow-lg">
          <Text className="text-white text-5xl">👤</Text>
        </View>
        <TouchableOpacity
          className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-4 border-background-dark shadow-md active:bg-accent-green"
          onPress={onEdit}
        >
          <Text className="text-background-dark text-lg">📷</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const InputField1 = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  disabled = false,
  rightIcon,
  type = "default",
  keyboardType = "default",
  unit,
}: {
  label: string;
  icon: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rightIcon?: string;
  type?: "default" | "password";
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  unit?: string;
}) => (
  <View className="flex-col gap-2">
    <Text className="text-sm font-semibold text-gray-300 ml-1">{label}</Text>
    <View
      className={`
      flex-row items-center gap-3 
      ${
        disabled
          ? "bg-icon-bg/40 border border-icon-bg opacity-80"
          : "bg-surface-dark border border-transparent focus-within:border-primary/50"
      }
      rounded-3xl px-4 py-3.5 transition-all
    `}
    >
      <Text className="text-primary text-xl">{icon}</Text>
      <TextInput
        className="flex-1 text-white text-base font-medium bg-transparent border-0 p-0 focus:ring-0"
        placeholder={placeholder}
        placeholderTextColor="rgb(107 114 128)"
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        keyboardType={keyboardType}
        secureTextEntry={type === "password"}
      />
      {rightIcon && <Text className="text-xl text-gray-500">{rightIcon}</Text>}
      {unit && (
        <Text className="text-sm text-gray-400 font-medium">{unit}</Text>
      )}
    </View>
  </View>
);

export default function PersonalInforScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Personal Information",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <ScrollView
        className="flex-1 bg-background p-8 flex-col gap-4"
        showsVerticalScrollIndicator={false}
      >
        <AvatarSection onEdit={() => {}} />

        <View className="flex-col gap-6 pb-10">
          {/* Email */}
          <InputField
            headIcon={
              <MaterialIcons name="mail-outline" size={24} color="black" />
            }
            trailingIcon={
              <MaterialIcons name="lock-outline" size={24} color="black" />
            }
            label="Email"
            value="thanhdong@gmail.com"
            isDisabled={true}
          />

          {/* Full Name */}
          <InputField
            headIcon={
              <MaterialIcons name="person-outline" size={24} color="black" />
            }
            label="Full Name"
            value="Nguyen Van A"
          />

          {/* Date of Birth */}

          {/* Gender */}
          <SelectedField />

          {/* Height & Weight */}
          <View className="flex-row gap-4">
            <View className="flex-1">
              <InputField
                headIcon={
                  <MaterialIcons name="height" size={24} color="black" />
                }
                label="Height"
                trailingIcon={<Text className="text-sm font-semibold">cm</Text>}
              />
            </View>

            <View className="flex-1">
              <InputField
                headIcon={
                  <MaterialIcons
                    name="monitor-weight"
                    size={24}
                    color="black"
                  />
                }
                label="Weight"
                trailingIcon={<Text className="text-sm font-semibold">kg</Text>}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
