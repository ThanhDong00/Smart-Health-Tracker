import PrimaryButton from "@/components/primary-button";
import { useTheme } from "@/hooks/useTheme";
import { socialService } from "@/services/social.service";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_NAME_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 200;

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

  const handleCreateGroup = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const response = await socialService.createGroup({
        name: groupName.trim(),
        description: description.trim() || undefined,
      });

      Toast.show({
        type: "success",
        text1: "Group Created!",
        text2: `${response.data.name} has been created successfully`,
      });

      // Navigate back to Groups screen
      setTimeout(() => {
        router.push("/social/groups");
      }, 1000);
    } catch (error: any) {
      console.error("Error creating group:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to create group",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            title={isSubmitting ? "Creating..." : "Create Group"}
            onPress={handleCreateGroup}
            disabled={!groupName.trim() || groupName.trim().length < 3 || isSubmitting}
            isDark={isDark}
          />
        </View>
      </KeyboardAvoidingView>

      <Toast />
    </SafeAreaView>
  );
}
