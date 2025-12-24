import PrimaryButton from "@/components/primary-button";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function CreateGroupScreen() {
  const { isDark } = useTheme();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const MAX_NAME_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 200;

  const handleSelectImage = () => {
    Alert.alert("Select Group Avatar", "Choose an option", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Choose from Gallery",
        onPress: () => {
          // Mock: simulate image selection
          setSelectedImage(
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
          );
          Toast.show({
            type: "success",
            text1: "Image Selected",
            text2: "Group avatar updated",
          });
        },
      },
    ]);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    Toast.show({
      type: "info",
      text1: "Image Removed",
      text2: "Default avatar will be used",
    });
  };

  const validateForm = (): boolean => {
    if (!groupName.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Group name is required",
      });
      return false;
    }

    if (groupName.trim().length < 3) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Group name must be at least 3 characters",
      });
      return false;
    }

    if (groupName.length > MAX_NAME_LENGTH) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Group name must not exceed ${MAX_NAME_LENGTH} characters`,
      });
      return false;
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
      });
      return false;
    }

    return true;
  };

  const handleCreateGroup = () => {
    if (!validateForm()) return;

    // Mock: simulate API call
    Toast.show({
      type: "success",
      text1: "Group Created!",
      text2: `${groupName} has been created successfully`,
    });

    // Navigate back to Groups screen
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      }`}
      edges={["top"]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Create Group",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: isDark ? "#0f0f23" : "#f8fafc",
          },
          headerTintColor: isDark ? "#ffffff" : "#1e293b",
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-8 pt-6">
          {/* Group Avatar Section */}
          <View className="items-center mb-8">
            <View className="relative">
              {/* Avatar Image */}
              <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                <Image
                  source={
                    selectedImage
                      ? { uri: selectedImage }
                      : require("../../../assets/images/group.png")
                  }
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              {/* Edit Button */}
              <TouchableOpacity
                onPress={handleSelectImage}
                className={`absolute bottom-0 right-0 w-10 h-10 rounded-full items-center justify-center ${isDark ? "bg-primary-dark" : "bg-primary"}`}
                style={{
                  elevation: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}
              >
                <MaterialIcons
                  name="camera-alt"
                  size={20}
                  color={isDark ? "#ffffff" : "#ffffff"}
                />
              </TouchableOpacity>

              {/* Remove Button (only show if image selected) */}
              {selectedImage && (
                <TouchableOpacity
                  onPress={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 items-center justify-center"
                  style={{
                    elevation: 4,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}
                >
                  <MaterialIcons name="close" size={16} color="#ffffff" />
                </TouchableOpacity>
              )}
            </View>

            <Text
              className={`text-sm mt-3 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
            >
              Tap to add group photo
            </Text>
          </View>

          {/* Group Name Input */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text
                className={`text-base font-semibold ${isDark ? "text-text-primary" : "text-text-dark"}`}
              >
                Group Name <Text className="text-red-500">*</Text>
              </Text>
              <Text
                className={`text-sm ${
                  groupName.length > MAX_NAME_LENGTH
                    ? "text-red-500"
                    : isDark
                      ? "text-text-secondary"
                      : "text-text-muted"
                }`}
              >
                {groupName.length}/{MAX_NAME_LENGTH}
              </Text>
            </View>
            <TextInput
              className={`rounded-xl p-4 text-base ${
                isDark
                  ? "bg-surface-dark text-text-primary border border-surface-variant-dark"
                  : "bg-white text-text-dark border border-gray-200"
              }`}
              placeholder="Enter group name"
              placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
              value={groupName}
              onChangeText={setGroupName}
              maxLength={MAX_NAME_LENGTH}
            />
            {groupName.length > 0 && groupName.length < 3 && (
              <Text className="text-xs text-red-500 mt-1">
                Minimum 3 characters required
              </Text>
            )}
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text
                className={`text-base font-semibold ${isDark ? "text-text-primary" : "text-text-dark"}`}
              >
                Description{" "}
                <Text
                  className={`text-sm font-normal ${isDark ? "text-text-secondary" : "text-text-muted"}`}
                >
                  (Optional)
                </Text>
              </Text>
              <Text
                className={`text-sm ${
                  description.length > MAX_DESCRIPTION_LENGTH
                    ? "text-red-500"
                    : isDark
                      ? "text-text-secondary"
                      : "text-text-muted"
                }`}
              >
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </Text>
            </View>
            <TextInput
              className={`rounded-xl p-4 text-base ${
                isDark
                  ? "bg-surface-dark text-text-primary border border-surface-variant-dark"
                  : "bg-white text-text-dark border border-gray-200"
              }`}
              placeholder="Tell others what this group is about"
              placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
              maxLength={MAX_DESCRIPTION_LENGTH}
              style={{ height: 120 }}
            />
          </View>

          {/* Info Card */}
          <View
            className={`rounded-xl p-4 mb-6 flex-row ${isDark ? "bg-primary-dark/10" : "bg-primary/10"}`}
          >
            <MaterialIcons
              name="info"
              size={20}
              color={isDark ? "#00b894" : "#7f27ff"}
            />
            <Text
              className={`text-sm ml-3 flex-1 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
            >
              Create a group to connect with people who share your fitness goals
              and interests.
            </Text>
          </View>
        </ScrollView>

        {/* Create Button */}
        <View className="px-8 py-6 pt-4">
          <PrimaryButton
            title="Create Group"
            onPress={handleCreateGroup}
            disabled={!groupName.trim() || groupName.trim().length < 3}
            isDark={isDark}
          />
        </View>
      </KeyboardAvoidingView>

      <Toast />
    </SafeAreaView>
  );
}
