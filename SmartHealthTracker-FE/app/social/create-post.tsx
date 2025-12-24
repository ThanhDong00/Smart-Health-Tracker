import PrimaryButton from "@/components/primary-button";
import PostAvatar from "@/components/ui/social/post-avatar";
import { useTheme } from "@/hooks/useTheme";
import { CloudinaryService } from "@/services/cloudinary.service";
import { socialService } from "@/services/social.service";
import { useUserStore } from "@/store/user.store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function CreatePostScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { profile } = useUserStore();
  const userName = profile ? `${profile.fullName}` : "User";

  const handleAddPhoto = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant photo library access to upload images"
        );
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images" as any,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to select image",
      });
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handlePost = async () => {
    if (!content.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter some content",
      });
      return;
    }

    try {
      setIsLoading(true);

      let imageUrl: string | undefined = undefined;

      // Upload image to Cloudinary if selected
      if (selectedImage) {
        setIsUploadingImage(true);
        imageUrl = await CloudinaryService.uploadImage(
          selectedImage,
          "social-posts"
        );
        setIsUploadingImage(false);
      }

      // Create post
      await socialService.createPost({
        content: content.trim(),
        imageUrl,
        visibility: "PUBLIC",
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Post created successfully!",
      });

      // Reset form and navigate back
      setContent("");
      setSelectedImage(null);
      // Wait a moment to show the toast
      setTimeout(() => {
        router.push("/(tabs)/social");
      }, 500);
    } catch (error: any) {
      console.error("Error creating post:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to create post",
      });
    } finally {
      setIsLoading(false);
      setIsUploadingImage(false);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      }`}
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
            editable={!isLoading}
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
            {!isLoading && (
              <TouchableOpacity
                onPress={handleRemoveImage}
                className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
              >
                <MaterialIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            )}
            {isUploadingImage && (
              <View className="absolute inset-0 bg-black/30 items-center justify-center rounded-xl">
                <ActivityIndicator size="large" color="white" />
                <Text className="text-white mt-2">Uploading...</Text>
              </View>
            )}
          </View>
        )}

        {/* Add Photo Button */}
        <TouchableOpacity
          onPress={handleAddPhoto}
          disabled={isLoading}
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
          title={isLoading ? "Posting..." : "Post"}
          onPress={handlePost}
          disabled={isLoading || !content.trim()}
          isDark={isDark}
        />
      </View>

      <Toast />
    </SafeAreaView>
  );
}
