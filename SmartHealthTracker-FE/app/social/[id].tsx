import PostAvatar from "@/components/ui/social/post-avatar";
import PostCart from "@/components/ui/social/post-card";
import { useTheme } from "@/hooks/useTheme";
import { Comment, Post, socialService } from "@/services/social.service";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function DetailPostScreen() {
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = parseInt(id || "0");
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPostAndComments();
    }
  }, [postId]);

  const fetchPostAndComments = async () => {
    try {
      fetchPost();
      fetchComments();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPost = async () => {
    try {
      setIsLoadingPost(true);
      const response = await socialService.getPostById(postId);
      if (response.data) {
        setPost(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching post:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to load post",
      });
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handlePostUpdate = () => {
    fetchPost();
  };

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await socialService.getComments(postId, 0, 50);
      if (response.data) {
        setComments(response.data.content);
      }
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to load comments",
      });
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await socialService.createComment(postId, {
        content: commentText.trim(),
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Comment posted!",
      });

      setCommentText("");
      fetchComments();
    } catch (error: any) {
      console.error("Error posting comment:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to post comment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderComment = useCallback(
    ({ item }: { item: Comment }) => (
      <View className="flex-row gap-3 mb-4">
        <View className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            source={
              item.user.avatarUrl
                ? { uri: item.user.avatarUrl }
                : // : require("../../assets/default-avatar.png")
                  { uri: "https://i.pravatar.cc/300" }
            }
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1">
          <View
            className={`rounded-2xl p-3 ${
              isDark ? "bg-surface-dark" : "bg-gray-100"
            }`}
          >
            <Text
              className={`font-semibold text-sm mb-1 ${
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              {item.user.fullName}
            </Text>
            <Text
              className={`text-sm ${
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              {item.content}
            </Text>
          </View>
          <Text
            className={`text-xs mt-1 ml-3 ${
              isDark ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
    ),
    [isDark]
  );

  const renderHeader = useCallback(
    () => (
      <>
        {/* Post Card */}
        {post && (
          <View className="mb-6">
            <PostCart
              post={post}
              isDark={isDark}
              disableComment={true}
              onPostUpdate={handlePostUpdate}
            />
          </View>
        )}

        {/* Comments Header */}
        <View className="mb-6">
          <Text
            className={`text-lg font-bold ${
              isDark ? "text-text-primary" : "text-text-dark"
            }`}
          >
            Comments ({comments.length})
          </Text>
        </View>
      </>
    ),
    [post, comments.length, isDark]
  );

  if (!postId) {
    return (
      <SafeAreaView
        className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}
        edges={[]}
      >
        <View className="flex-1 items-center justify-center">
          <Text>Invalid post ID</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}
      edges={[]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Post Details",
          headerTitleStyle: { fontWeight: "bold" },
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
        keyboardVerticalOffset={0}
      >
        {isLoadingPost && !post ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color={isDark ? "#00b894" : "#7f27ff"}
            />
            <Text
              className={`mt-4 text-base ${isDark ? "text-text-secondary" : "text-text-muted"}`}
            >
              Loading...
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={
                isLoadingComments ? (
                  <View className="py-10 items-center">
                    <ActivityIndicator
                      size="small"
                      color={isDark ? "#00b894" : "#7f27ff"}
                    />
                  </View>
                ) : (
                  <View className="py-10 items-center">
                    <Text
                      className={
                        isDark ? "text-text-secondary" : "text-text-muted"
                      }
                    >
                      No comments yet. Be the first!
                    </Text>
                  </View>
                )
              }
              extraData={comments}
            />

            {/* Comment Input */}
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

              <View className="flex-1 flex-row items-center">
                <TextInput
                  className={`flex-1 rounded-full px-4 py-2.5 text-base ${
                    isDark
                      ? "bg-background-dark text-text-primary border border-surface-variant-dark"
                      : "bg-gray-100 text-text-dark"
                  }`}
                  placeholder="Write a comment..."
                  placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                  value={commentText}
                  onChangeText={setCommentText}
                  editable={!isSubmitting}
                  multiline
                  maxLength={500}
                />

                <TouchableOpacity
                  onPress={handleSendComment}
                  disabled={!commentText.trim() || isSubmitting}
                  className="ml-2"
                  activeOpacity={0.7}
                >
                  {isSubmitting ? (
                    <ActivityIndicator
                      size="small"
                      color={isDark ? "#00b894" : "#7f27ff"}
                    />
                  ) : (
                    <MaterialIcons
                      name="send"
                      size={28}
                      color={
                        commentText.trim()
                          ? isDark
                            ? "#00b894"
                            : "#7f27ff"
                          : "#9ca3af"
                      }
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </KeyboardAvoidingView>

      <Toast />
    </SafeAreaView>
  );
}
