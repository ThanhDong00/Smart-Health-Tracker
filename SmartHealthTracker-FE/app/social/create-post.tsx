import PrimaryButton from "@/components/primary-button";
import PostAvatar from "@/components/ui/social/post-avatar";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreatePostScreen() {
  const { isDark } = useTheme();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock data
  const userName = "John Doe";

  const handleAddPhoto = () => {
    // Mock: simulate image selection
    Alert.alert("Add Photo", "Image picker will be implemented here", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Select Mock Image",
        onPress: () =>
          setSelectedImage(
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
          ),
      },
    ]);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handlePost = () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please enter some content");
      return;
    }
    Alert.alert("Success", "Post created successfully!");
    // Reset form
    setContent("");
    setSelectedImage(null);
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
          title: "Create Post",
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

      <ScrollView className="flex-1 p-6">
        {/* User Avatar & Name */}
        <View className="flex-row items-center gap-4 mb-6">
          <View className="w-12 h-12 rounded-full overflow-hidden">
            <PostAvatar />
          </View>
          <Text
            className={`font-bold text-lg ${
              isDark ? "text-text-primary" : "text-text-dark"
            }`}
          >
            {userName}
          </Text>
        </View>

        {/* Content Input */}
        <View className="mb-6">
          <TextInput
            className={`rounded-xl p-4 text-base ${
              isDark
                ? "bg-surface-dark text-text-primary border border-surface-variant-dark"
                : "bg-white text-text-dark border border-gray-200"
            }`}
            placeholder="What's on your mind?"
            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={content}
            onChangeText={setContent}
            style={{ height: 150 }}
          />
        </View>

        {/* Image Preview */}
        {selectedImage && (
          <View className="mb-6 relative">
            <View className="w-full h-48 rounded-xl overflow-hidden">
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            {/* Remove Image Button */}
            <TouchableOpacity
              onPress={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
            >
              <MaterialIcons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Add Photo Button */}
        <TouchableOpacity
          onPress={handleAddPhoto}
          className={`flex-row items-center justify-center gap-2 rounded-xl p-4 mb-6 border-2 border-dashed ${
            isDark
              ? "border-surface-variant-dark bg-surface-dark/50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <MaterialIcons
            name="add-photo-alternate"
            size={24}
            color={isDark ? "#a1a1aa" : "#6b7280"}
          />
          <Text
            className={`font-semibold ${
              isDark ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            {selectedImage ? "Change Photo" : "Add Photo"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Post Button */}
      <View className="p-6 pt-2 mb-8">
        <PrimaryButton
          title="Post"
          onPress={handlePost}
          disabled={!content.trim()}
          isDark={isDark}
        />
      </View>
    </SafeAreaView>
  );
}
