import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { socialService } from "@/services/social.service";
import Toast from "react-native-toast-message";

type PostActionProps = {
  postId: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
  commentCount: number;
  isDark?: boolean;
  onCommentPress?: () => void;
  onLikeUpdate?: (isLiked: boolean, likeCount: number) => void;
};

const PostAction = ({ 
  postId, 
  initialIsLiked, 
  initialLikeCount, 
  commentCount,
  isDark, 
  onCommentPress,
  onLikeUpdate 
}: PostActionProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;

    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    try {
      setIsLiking(true);
      
      // Optimistic update
      const newIsLiked = !isLiked;
      const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
      
      setIsLiked(newIsLiked);
      setLikeCount(newLikeCount);
      
      if (onLikeUpdate) {
        onLikeUpdate(newIsLiked, newLikeCount);
      }

      // Call API
      if (newIsLiked) {
        await socialService.likePost(postId);
      } else {
        await socialService.unlikePost(postId);
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      
      // Revert on error
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      
      if (onLikeUpdate) {
        onLikeUpdate(previousIsLiked, previousLikeCount);
      }

      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to update like",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <View className="flex-row items-center gap-6">
      {/* Like */}
      <TouchableOpacity
        className="flex-row items-center gap-1.5"
        onPress={handleLike}
        disabled={isLiking}
        activeOpacity={0.7}
      >
        <MaterialIcons 
          name={isLiked ? "favorite" : "favorite-border"} 
          size={24} 
          color={isLiked ? "#ef4444" : (isDark ? "#a1a1aa" : "#6b7280")} 
        />
        <Text
          className={`text-sm ${
            isLiked 
              ? "text-red-500" 
              : isDark ? "text-text-secondary" : "text-text-muted"
          }`}
        >
          {likeCount}
        </Text>
      </TouchableOpacity>

      {/* Comment */}
      <TouchableOpacity
        className="flex-row items-center gap-1.5"
        onPress={onCommentPress}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="comment"
          size={24}
          color={isDark ? "#00b894" : "#7f27ff"}
        />
        <Text
          className={`text-sm ${
            isDark ? "text-text-secondary" : "text-text-muted"
          }`}
        >
          {commentCount}
        </Text>
      </TouchableOpacity>

      {/* Share */}
      <TouchableOpacity
        className="flex items-center gap-1.5"
        onPress={() => {
          Toast.show({
            type: "info",
            text1: "Coming Soon",
            text2: "Share feature will be available soon",
          });
        }}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="share"
          size={24}
          color={isDark ? "#00b894" : "#7f27ff"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PostAction;
