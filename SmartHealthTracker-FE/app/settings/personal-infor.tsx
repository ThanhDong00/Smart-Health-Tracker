import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import PrimaryButton from "@/components/primary-button";
import DobInputField from "@/components/ui/dob-input-field";
import InputField from "@/components/ui/input-field";
import SelectedField from "@/components/ui/selected-field";
import { useUserStore } from "@/store/user.store";

type FormState = {
  email: string;
  fullName: string;
  gender: string;
  dateOfBirth?: Date;
  height: string;
  weight: string;
};

const AvatarSection = ({ onEdit }: { onEdit: () => void }) => (
  <View className="flex-col items-center justify-center pt-2 pb-8">
    <View className="relative">
      <View className="w-28 h-28 rounded-full items-center justify-center overflow-hidden border-2 border-background-dark shadow-lg">
        <Image
          source={{ uri: "https://i.pravatar.cc/300" }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <TouchableOpacity
        className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-background-dark shadow-md active:bg-accent-green"
        onPress={onEdit}
      >
        <MaterialIcons name="camera-alt" size={12} color="white" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function PersonalInforScreen() {
  const { profile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormState>({
    email: "",
    fullName: "",
    gender: "Not Specified",
    dateOfBirth: undefined,
    height: "",
    weight: "",
  });

  const initialFormFromProfile = useMemo<FormState>(() => {
    const email = profile?.data.email ?? "";

    let fullName = profile?.data.fullName?.trim() ?? "";
    if (!fullName && email) {
      fullName = email.split("@")[0];
    }

    return {
      email,
      fullName,
      gender: profile?.data.gender || "Not Specified",
      dateOfBirth: profile?.data.dateOfBirth
        ? new Date(profile.data.dateOfBirth)
        : undefined,
      height: profile?.data.heightCm ? String(profile.data.heightCm) : "",
      weight: profile?.data.weightKg ? String(profile.data.weightKg) : "",
    };
  }, [profile]);

  useEffect(() => {
    setForm(initialFormFromProfile);
  }, [initialFormFromProfile]);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = () => {
    const formData = {
      email: form.email,
      fullName: form.fullName || null,
      gender: form.gender === "Not Specified" ? null : form.gender,
      dateOfBirth: form.dateOfBirth || null,
      height: form.height ? Number(form.height) : null,
      weight: form.weight ? Number(form.weight) : null,
    };

    setIsEditing(false);
    console.log("Saved form data:", formData);
  };

  const handleButtonPress = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

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
        className="flex-1 bg-background px-8"
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          <AvatarSection onEdit={() => {}} />

          <View className="flex-col gap-6 pb-10">
            {/* Email (read-only) */}
            <InputField
              headIcon={<MaterialIcons name="mail" size={24} color="black" />}
              trailingIcon={
                <MaterialIcons name="lock-outline" size={24} color="black" />
              }
              label="Email"
              value={form.email}
              isDisabled
            />

            {/* Full Name */}
            <InputField
              headIcon={<MaterialIcons name="person" size={24} color="black" />}
              label="Full Name"
              value={form.fullName}
              isDisabled={!isEditing}
              onChange={(text) => updateField("fullName", text)}
            />

            {/* Date of Birth */}
            <DobInputField
              headIcon={<MaterialIcons name="cake" size={24} color="black" />}
              label="Date of Birth"
              value={form.dateOfBirth}
              onChange={(date) => updateField("dateOfBirth", date)}
              isDisabled={!isEditing}
            />

            {/* Gender */}
            <SelectedField
              headIcon={<MaterialIcons name="wc" size={24} color="black" />}
              label="Gender"
              options={["Male", "Female", "Other"]}
              value={form.gender}
              onChangeValue={(value) => updateField("gender", value)}
              isDisabled={!isEditing}
            />

            {/* Height & Weight */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <InputField
                  headIcon={
                    <MaterialIcons name="height" size={24} color="black" />
                  }
                  trailingIcon={
                    <Text className="text-sm font-semibold">cm</Text>
                  }
                  label="Height"
                  keyboardType="numeric"
                  value={form.height}
                  isDisabled={!isEditing}
                  onChange={(text) => updateField("height", text)}
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
                  trailingIcon={
                    <Text className="text-sm font-semibold">kg</Text>
                  }
                  label="Weight"
                  keyboardType="numeric"
                  value={form.weight}
                  isDisabled={!isEditing}
                  onChange={(text) => updateField("weight", text)}
                />
              </View>
            </View>
          </View>
        </View>

        <View>
          <PrimaryButton
            title={isEditing ? "Save Changes" : "Edit Profile"}
            onPress={handleButtonPress}
          />
        </View>
      </ScrollView>
    </>
  );
}
