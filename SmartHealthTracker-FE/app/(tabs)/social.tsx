import PostAvatar from "@/components/ui/social/post-avatar";
import PostCart from "@/components/ui/social/post-card";
import { useTheme } from "@/hooks/useTheme";
import { router, Stack } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SocialScreen() {
  const { isDark } = useTheme();

  const tempPostId = 1;

  const handleCommentPress = () => {
    router.push(`/social/${tempPostId}`);
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      } p-8`}
      edges={["top"]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Social",
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

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-col gap-4">
          {/* Create Post Card */}
          <View
            className={`flex-row items-center rounded-2xl p-4 ${isDark ? "bg-surface-dark shadow-lg" : "bg-card-light shadow-md"} gap-4`}
          >
            <View className="w-12 h-12 rounded-full overflow-hidden">
              <PostAvatar />
            </View>
            <View className="flex-1">
              <TouchableOpacity
                className="p-3 border border-border-light rounded-full"
                onPress={() => {
                  console.log("NEW POST");
                  router.push("/social/create-post");
                }}
              >
                <Text
                  className={`${isDark ? "text-text-primary/50" : "text-text-dark/50"} text-base text-center`}
                >
                  What's on your mind?
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <PostCart onCommentPress={handleCommentPress} />
          <PostCart />
          <PostCart />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
