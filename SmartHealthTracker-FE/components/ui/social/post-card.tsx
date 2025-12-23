import { Image, Text, View } from "react-native";
import PostAction from "./post-action";
import PostAvatar from "./post-avatar";

type PostCardProps = {
  isDark?: boolean;
  onCommentPress?: () => void;
};

const PostCart = ({ isDark, onCommentPress }: PostCardProps) => {
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
            John Doe
          </Text>

          <Text
            className={`text-sm ${
              isDark ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            2 hours ago
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
          Just finished a 5k run! Feeling great and energized. #fitness #running
        </Text>
      </View>

      {/* Image */}
      <View className="w-full h-48 rounded-xl overflow-hidden">
        <Image
          source={{
            uri: "https://i.pravatar.cc/300",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Action button */}
      <View>
        <PostAction onCommentPress={onCommentPress} />
      </View>
    </View>
  );
};

export default PostCart;
