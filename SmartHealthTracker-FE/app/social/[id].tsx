import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import PostAvatar from "@/components/ui/social/post-avatar";
import PostAction from "@/components/ui/social/post-action";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Mock data
const mockPost = {
  id: "1",
  user: {
    fullName: "John Doe",
    avatarUrl: "https://i.pravatar.cc/300",
  },
  createdAt: "2 hours ago",
  content:
    "Just finished a 5k run! Feeling great and energized. #fitness #running",
  imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
  likeCount: 24,
  commentCount: 5,
};

const mockComments = [
  {
    id: "1",
    user: {
      fullName: "Sarah Johnson",
      avatarUrl: "https://i.pravatar.cc/300?img=1",
    },
    content: "Great job! Keep it up! 💪",
    createdAt: "1 hour ago",
  },
  {
    id: "2",
    user: {
      fullName: "Mike Wilson",
      avatarUrl: "https://i.pravatar.cc/300?img=2",
    },
    content: "Awesome! What's your pace?",
    createdAt: "1 hour ago",
  },
  {
    id: "3",
    user: {
      fullName: "Emma Davis",
      avatarUrl: "https://i.pravatar.cc/300?img=3",
    },
    content: "Inspiring! I should do this too 🏃‍♀️",
    createdAt: "45 minutes ago",
  },
  {
    id: "4",
    user: {
      fullName: "Alex Brown",
      avatarUrl: "https://i.pravatar.cc/300?img=4",
    },
    content: "Nice work! Running in the morning is the best!",
    createdAt: "30 minutes ago",
  },
];

export default function DetailPostScreen() {
  const { isDark } = useTheme();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(mockComments);

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: String(comments.length + 1),
      user: {
        fullName: "John Doe",
        avatarUrl: "https://i.pravatar.cc/300",
      },
      content: commentText,
      createdAt: "Just now",
    };

    setComments([...comments, newComment]);
    setCommentText("");
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
          title: "Post Detail",
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
        keyboardVerticalOffset={100}
      >
        <ScrollView className="flex-1">
          {/* Post Content */}
          <View
            className={`m-4 rounded-2xl p-4 ${
              isDark ? "bg-surface-dark shadow-lg" : "bg-card-light shadow-md"
            }`}
          >
            {/* Header - User Info */}
            <View className="flex-row items-center gap-4 mb-4">
              <View className="w-12 h-12 rounded-full overflow-hidden">
                <PostAvatar />
              </View>

              <View className="flex-col gap-1">
                <Text
                  className={`font-bold text-base ${
                    isDark ? "text-text-primary" : "text-text-dark"
                  }`}
                >
                  {mockPost.user.fullName}
                </Text>

                <Text
                  className={`text-sm ${
                    isDark ? "text-text-secondary" : "text-text-muted"
                  }`}
                >
                  {mockPost.createdAt}
                </Text>
              </View>
            </View>

            {/* Post Content */}
            <View className="mb-4">
              <Text
                className={`text-base ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                {mockPost.content}
              </Text>
            </View>

            {/* Post Image */}
            {mockPost.imageUrl && (
              <View className="w-full h-64 rounded-xl overflow-hidden mb-4">
                <Image
                  source={{ uri: mockPost.imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Post Action */}
            <PostAction />
          </View>

          {/* Comments Section */}
          <View className="px-4 pb-4">
            <Text
              className={`text-lg font-bold mb-4 ${
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              Comments ({comments.length})
            </Text>

            {comments.map((comment) => (
              <View
                key={comment.id}
                className={`flex-row gap-3 mb-4 p-3 rounded-xl ${
                  isDark ? "bg-surface-dark" : "bg-gray-50"
                }`}
              >
                <View className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    source={{ uri: comment.user.avatarUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text
                      className={`font-bold text-sm ${
                        isDark ? "text-text-primary" : "text-text-dark"
                      }`}
                    >
                      {comment.user.fullName}
                    </Text>
                    <Text
                      className={`text-xs ${
                        isDark ? "text-text-secondary" : "text-text-muted"
                      }`}
                    >
                      {comment.createdAt}
                    </Text>
                  </View>
                  <Text
                    className={`text-sm ${
                      isDark ? "text-text-primary" : "text-text-dark"
                    }`}
                  >
                    {comment.content}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Input Comment Section - Fixed at bottom */}
        <View
          className={`flex-row items-center gap-3 p-4 border-t ${
            isDark
              ? "bg-surface-dark border-surface-variant-dark"
              : "bg-white border-gray-200"
          }`}
        >
          <View className="w-10 h-10 rounded-full overflow-hidden">
            <PostAvatar />
          </View>

          <View className="flex-1">
            <TextInput
              className={`rounded-full px-4 py-2 ${
                isDark
                  ? "bg-surface-variant-dark text-text-primary"
                  : "bg-gray-100 text-text-dark"
              }`}
              placeholder="Write a comment..."
              placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
              value={commentText}
              onChangeText={setCommentText}
            />
          </View>

          <TouchableOpacity
            onPress={handleSendComment}
            disabled={!commentText.trim()}
            className={`p-2 rounded-full ${
              commentText.trim()
                ? "bg-primary"
                : isDark
                ? "bg-surface-variant-dark"
                : "bg-gray-300"
            }`}
          >
            <MaterialIcons
              name="send"
              size={20}
              color={commentText.trim() ? "white" : isDark ? "#6b7280" : "#9ca3af"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
