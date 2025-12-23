import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type PostActionProps = {
  isDark?: boolean;
  onCommentPress?: () => void;
};

const PostAction = ({ isDark, onCommentPress }: PostActionProps) => {
  return (
    <View className="flex-row items-center gap-6">
      {/* Like */}
      <TouchableOpacity
        className={`flex flex-row items-center gap-1.5 ${
          // post.stats.liked ? 'text-red-500' : 'hover:text-red-500'
          "text-red-500"
        } transition-colors`}
      >
        <MaterialIcons name="favorite" size={24} color="red" />
        <Text
          className={`text-sm ${
            isDark ? "text-text-secondary" : "text-text-muted"
          }`}
        >
          24
        </Text>
      </TouchableOpacity>

      {/* Comment */}
      <TouchableOpacity
        className="flex-row items-center gap-1.5 hover:text-primary transition-colors"
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
          24
        </Text>
      </TouchableOpacity>

      {/* Share */}
      <TouchableOpacity
        className="flex items-center gap-1.5 hover:text-primary transition-colors"
        onPress={() => {}}
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
