import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "@/components/primary-button";
import DobInputField from "@/components/ui/dob-input-field";
import InputField from "@/components/ui/input-field";
import SelectedField from "@/components/ui/selected-field";
import { CloudinaryService } from "@/services/cloudinary.service";
import { UserService } from "@/services/user.service";
import { useUserStore } from "@/store/user.store";

type FormState = {
  email: string;
  fullName: string;
  gender: string;
  dateOfBirth?: Date;
  height: string;
  weight: string;
};

const AvatarSection = ({
  avatarUrl,
  onEdit,
  isUploading,
}: {
  avatarUrl?: string;
  onEdit: () => void;
  isUploading: boolean;
}) => (
  <View className="flex-col items-center justify-center pt-2 pb-8">
    <View className="relative">
      <View className="w-28 h-28 rounded-full items-center justify-center overflow-hidden border-2 border-background-dark shadow-lg">
        {isUploading ? (
          <View className="w-full h-full items-center justify-center bg-gray-200 dark:bg-gray-700">
            <ActivityIndicator size="large" color="#00b894" />
          </View>
        ) : (
          <Image
            source={{
              uri: avatarUrl || "https://i.pravatar.cc/300",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        )}
      </View>
      <TouchableOpacity
        className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-background-dark shadow-md active:bg-accent-green"
        onPress={onEdit}
        disabled={isUploading}
      >
        <MaterialIcons name="camera-alt" size={12} color="white" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function PersonalInforScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { profile, setProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [form, setForm] = useState<FormState>({
    email: "",
    fullName: "",
    gender: "Not Specified",
    dateOfBirth: undefined,
    height: "",
    weight: "",
  });

  const initialFormFromProfile = useMemo<FormState>(() => {
    const email = profile?.email ?? "";

    let fullName = profile?.fullName?.trim() ?? "";
    if (!fullName && email) {
      fullName = email.split("@")[0];
    }

    return {
      email,
      fullName,
      gender: profile?.gender || "Not Specified",
      dateOfBirth: profile?.dateOfBirth
        ? new Date(profile.dateOfBirth)
        : undefined,
      height: profile?.heightCm ? String(profile.heightCm) : "",
      weight: profile?.weightKg ? String(profile.weightKg) : "",
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

  const validateForm = (): boolean => {
    // Validate height
    if (
      form.height &&
      (isNaN(Number(form.height)) || Number(form.height) <= 0)
    ) {
      Alert.alert("Validation Error", "Height must be a positive number");
      return false;
    }

    // Validate weight
    if (
      form.weight &&
      (isNaN(Number(form.weight)) || Number(form.weight) <= 0)
    ) {
      Alert.alert("Validation Error", "Weight must be a positive number");
      return false;
    }

    // Validate date of birth (not in future)
    if (form.dateOfBirth && form.dateOfBirth > new Date()) {
      Alert.alert("Validation Error", "Date of birth cannot be in the future");
      return false;
    }

    return true;
  };

  const handleAvatarUpload = async () => {
    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to upload an avatar"
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images" as any,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const imageUri = result.assets[0].uri;

      // Validate image size (< 5MB)
      const isValidSize = await CloudinaryService.validateImageSize(
        imageUri,
        5
      );

      if (!isValidSize) {
        Alert.alert(
          "File Too Large",
          "Please select an image smaller than 5MB"
        );
        return;
      }

      // Upload to Cloudinary
      setIsUploadingAvatar(true);
      const avatarUrl = await CloudinaryService.uploadImage(
        imageUri,
        "smarthealth"
      );

      // Update avatar via API
      const response = await UserService.updateAvatar({ avatarUrl });

      if (response.status === 200) {
        // Update profile in store
        setProfile(response.data);
        Alert.alert("Success", "Avatar updated successfully");
      } else {
        Alert.alert("Error", response.message || "Failed to update avatar");
      }
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      Alert.alert(
        "Upload Failed",
        error.message || "An error occurred while uploading the avatar"
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const formData = {
      // email: form.email,
      fullName: form.fullName || null,
      gender: form.gender === "Not Specified" ? null : form.gender,
      dateOfBirth: form.dateOfBirth || null,
      heightCm: form.height ? Number(form.height) : null,
      weightKg: form.weight ? Number(form.weight) : null,
    };

    setIsLoading(true);
    try {
      const response = await UserService.updateUserProfile(formData);

      if (response.message === "User profile updated successfully") {
        // Update profile in store
        setProfile(response.data);
        setIsEditing(false);

        Alert.alert("Success", "Profile updated successfully");
      } else {
        Alert.alert("Error", response.message || "Failed to update profile");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "An error occurred while updating profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonPress = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  useEffect(() => {
    console.log("Profile changed:", profile);
  }, [profile]);

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      }`}
      edges={["top"]}
    >
      <Stack.Screen
        options={{
          title: "Personal Information",
          headerShown: true,
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: isDark ? "#1a1a1a" : "#f8fafc",
          },
          headerTintColor: isDark ? "#ffffff" : "#1e293b",
        }}
      />

      <ScrollView
        className="flex-1 px-8"
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          <AvatarSection
            avatarUrl={profile?.avatarUrl}
            onEdit={handleAvatarUpload}
            isUploading={isUploadingAvatar}
          />

          <View className="flex-col gap-6 pb-10">
            {/* Email (read-only) */}
            <InputField
              headIcon={
                <MaterialIcons
                  name="mail"
                  size={24}
                  color={isDark ? "#00b894" : "#7f27ff"}
                />
              }
              trailingIcon={
                <MaterialIcons
                  name="lock-outline"
                  size={24}
                  color={isDark ? "#a6adc8" : "#64748b"}
                />
              }
              label="Email"
              value={form.email}
              isDisabled
              isDark={isDark}
            />

            {/* Full Name */}
            <InputField
              headIcon={
                <MaterialIcons
                  name="person"
                  size={24}
                  color={isDark ? "#00b894" : "#7f27ff"}
                />
              }
              label="Full Name"
              value={form.fullName}
              isDisabled={!isEditing}
              onChange={(text) => updateField("fullName", text)}
              isDark={isDark}
            />

            {/* Date of Birth */}
            <DobInputField
              headIcon={
                <MaterialIcons
                  name="cake"
                  size={24}
                  color={isDark ? "#00b894" : "#7f27ff"}
                />
              }
              label="Date of Birth"
              value={form.dateOfBirth}
              onChange={(date) => updateField("dateOfBirth", date)}
              isDisabled={!isEditing}
              isDark={isDark}
            />

            {/* Gender */}
            <SelectedField
              headIcon={
                <MaterialIcons
                  name="wc"
                  size={24}
                  color={isDark ? "#00b894" : "#7f27ff"}
                />
              }
              label="Gender"
              options={["Male", "Female", "Other"]}
              value={form.gender}
              onChangeValue={(value) => updateField("gender", value)}
              isDisabled={!isEditing}
              isDark={isDark}
            />

            {/* Height & Weight */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <InputField
                  headIcon={
                    <MaterialIcons
                      name="height"
                      size={24}
                      color={isDark ? "#00b894" : "#7f27ff"}
                    />
                  }
                  trailingIcon={
                    <Text
                      className={`text-sm font-semibold ${
                        isDark ? "text-text-secondary" : "text-text-muted"
                      }`}
                    >
                      cm
                    </Text>
                  }
                  label="Height"
                  keyboardType="numeric"
                  value={form.height}
                  isDisabled={!isEditing}
                  onChange={(text) => updateField("height", text)}
                  isDark={isDark}
                />
              </View>

              <View className="flex-1">
                <InputField
                  headIcon={
                    <MaterialIcons
                      name="monitor-weight"
                      size={24}
                      color={isDark ? "#00b894" : "#7f27ff"}
                    />
                  }
                  trailingIcon={
                    <Text
                      className={`text-sm font-semibold ${
                        isDark ? "text-text-secondary" : "text-text-muted"
                      }`}
                    >
                      kg
                    </Text>
                  }
                  label="Weight"
                  keyboardType="numeric"
                  value={form.weight}
                  isDisabled={!isEditing}
                  onChange={(text) => updateField("weight", text)}
                  isDark={isDark}
                />
              </View>
            </View>
          </View>
        </View>

        <View>
          <PrimaryButton
            title={isEditing ? "Save Changes" : "Edit Profile"}
            onPress={handleButtonPress}
            disabled={isLoading}
            isDark={isDark}
            // isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
