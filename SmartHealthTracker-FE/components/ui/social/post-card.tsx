import { useState } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { Post } from "@/services/social.service";
import PostAction from "./post-action";
import PostAvatar from "./post-avatar";

type PostCardProps = {
  post: Post;
  isDark?: boolean;
  onCommentPress?: () => void;
  onPostUpdate?: () => void;
};

const PostCart = ({ post, isDark, onCommentPress, onPostUpdate }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  // Format date
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

  const handleLikeUpdate = (newIsLiked: boolean, newLikeCount: number) => {
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
  };

  return (
    <View
      className={`rounded-2xl p-4 ${
        isDark ? "bg-surface-dark shadow-lg" : "bg-card-light shadow-md"
      } gap-4`}
    >
      {/* Header */}
      <View className="flex-row items-center gap-4">
        <View className="w-12 h-12 rounded-full overflow-hidden">
          <PostAvatar />
        </View>

        <View className="flex-col gap-1">
          <Text
            className={`font-bold text-base ${
              isDark ? "text-text-primary" : "text-text-dark"
            }`}
          >
            User #{post.userId}
          </Text>

          <Text
            className={`text-sm ${
              isDark ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            {formatDate(post.createdAt)}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View>
        <Text
          className={`text-base ${
            isDark ? "text-text-primary" : "text-text-dark"
          }`}
        >
          {post.content}
        </Text>
      </View>

      {/* Image */}
      {post.imageUrl && (
        <View className="w-full h-48 rounded-xl overflow-hidden">
          <Image
            source={{ uri: post.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      )}

      {/* Action button */}
      <View>
        <PostAction 
          postId={post.id}
          initialIsLiked={isLiked}
          initialLikeCount={likeCount}
          commentCount={post.commentCount}
          onCommentPress={onCommentPress}
          onLikeUpdate={handleLikeUpdate}
          isDark={isDark}
        />
      </View>
    </View>
  );
};

export default PostCart;
