import PostAvatar from "@/components/ui/social/post-avatar";
import { useTheme } from "@/hooks/useTheme";
import { Comment, Post, socialService } from "@/services/social.service";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function DetailPostScreen() {
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = parseInt(id || "0");

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
      // Fetch post from posts list (we'll need to fetch all posts to find this one)
      // For now, we'll fetch comments only
      fetchComments();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
      setIsLoadingPost(false);
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

      // Refresh comments
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

  const renderComment = ({ item }: { item: Comment }) => (
    <View className="flex-row gap-3 mb-4">
      <View className="w-10 h-10 rounded-full overflow-hidden">
        <PostAvatar />
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
            User #{item.userId}
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
  );

  return (
    <View
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      }`}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Post Details",
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
        {isLoadingPost ? (
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
              contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View className="mb-6">
                  <Text
                    className={`text-lg font-bold mb-4 ${
                      isDark ? "text-text-primary" : "text-text-dark"
                    }`}
                  >
                    Comments ({comments.length})
                  </Text>
                </View>
              }
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
            />

            {/* Comment Input */}
            <View
              className={`flex-row items-center gap-3 p-6 border-t ${
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
    </View>
  );
}

//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//         keyboardVerticalOffset={100}
//       >
//         <ScrollView className="flex-1">
//           {/* Post Content */}
//           <View
//             className={`m-4 rounded-2xl p-4 ${
//               isDark ? "bg-surface-dark shadow-lg" : "bg-card-light shadow-md"
//             }`}
//           >
//             {/* Header - User Info */}
//             <View className="flex-row items-center gap-4 mb-4">
//               <View className="w-12 h-12 rounded-full overflow-hidden">
//                 <PostAvatar />
//               </View>

//               <View className="flex-col gap-1">
//                 <Text
//                   className={`font-bold text-base ${
//                     isDark ? "text-text-primary" : "text-text-dark"
//                   }`}
//                 >
//                   {mockPost.user.fullName}
//                 </Text>

//                 <Text
//                   className={`text-sm ${
//                     isDark ? "text-text-secondary" : "text-text-muted"
//                   }`}
//                 >
//                   {mockPost.createdAt}
//                 </Text>
//               </View>
//             </View>

//             {/* Post Content */}
//             <View className="mb-4">
//               <Text
//                 className={`text-base ${
//                   isDark ? "text-text-primary" : "text-text-dark"
//                 }`}
//               >
//                 {mockPost.content}
//               </Text>
//             </View>

//             {/* Post Image */}
//             {mockPost.imageUrl && (
//               <View className="w-full h-64 rounded-xl overflow-hidden mb-4">
//                 <Image
//                   source={{ uri: mockPost.imageUrl }}
//                   className="w-full h-full"
//                   resizeMode="cover"
//                 />
//               </View>
//             )}

//             {/* Post Action */}
//             <PostAction />
//           </View>

//           {/* Comments Section */}
//           <View className="px-4 pb-4">
//             <Text
//               className={`text-lg font-bold mb-4 ${
//                 isDark ? "text-text-primary" : "text-text-dark"
//               }`}
//             >
//               Comments ({comments.length})
//             </Text>

//             {comments.map((comment) => (
//               <View
//                 key={comment.id}
//                 className={`flex-row gap-3 mb-4 p-3 rounded-xl ${
//                   isDark ? "bg-surface-dark" : "bg-gray-50"
//                 }`}
//               >
//                 <View className="w-10 h-10 rounded-full overflow-hidden">
//                   <Image
//                     source={{ uri: comment.user.avatarUrl }}
//                     className="w-full h-full"
//                     resizeMode="cover"
//                   />
//                 </View>

//                 <View className="flex-1">
//                   <View className="flex-row items-center justify-between mb-1">
//                     <Text
//                       className={`font-bold text-sm ${
//                         isDark ? "text-text-primary" : "text-text-dark"
//                       }`}
//                     >
//                       {comment.user.fullName}
//                     </Text>
//                     <Text
//                       className={`text-xs ${
//                         isDark ? "text-text-secondary" : "text-text-muted"
//                       }`}
//                     >
//                       {comment.createdAt}
//                     </Text>
//                   </View>
//                   <Text
//                     className={`text-sm ${
//                       isDark ? "text-text-primary" : "text-text-dark"
//                     }`}
//                   >
//                     {comment.content}
//                   </Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </ScrollView>

//         {/* Input Comment Section - Fixed at bottom */}
//         <View
//           className={`flex-row items-center gap-3 p-4 border-t ${
//             isDark
//               ? "bg-surface-dark border-surface-variant-dark"
//               : "bg-white border-gray-200"
//           }`}
//         >
//           <View className="w-10 h-10 rounded-full overflow-hidden">
//             <PostAvatar />
//           </View>

//           <View className="flex-1">
//             <TextInput
//               className={`rounded-full px-4 py-2 ${
//                 isDark
//                   ? "bg-surface-variant-dark text-text-primary"
//                   : "bg-gray-100 text-text-dark"
//               }`}
//               placeholder="Write a comment..."
//               placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
//               value={commentText}
//               onChangeText={setCommentText}
//             />
//           </View>

//           <TouchableOpacity
//             onPress={handleSendComment}
//             disabled={!commentText.trim()}
//             className={`p-2 rounded-full ${
//               commentText.trim()
//                 ? "bg-primary"
//                 : isDark
//                 ? "bg-surface-variant-dark"
//                 : "bg-gray-300"
//             }`}
//           >
//             <MaterialIcons
//               name="send"
//               size={20}
//               color={commentText.trim() ? "white" : isDark ? "#6b7280" : "#9ca3af"}
//             />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }
