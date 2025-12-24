import PostCart from "@/components/ui/social/post-card";
import { useTheme } from "@/hooks/useTheme";
import { Post, socialService } from "@/services/social.service";
import { useUserStore } from "@/store/user.store";
import { router, Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function SocialScreen() {
  const { isDark } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { profile } = useUserStore();

  // Fetch posts
  const fetchPosts = async (page: number = 0, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else if (page === 0) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await socialService.getPosts(page, 10);

      if (response.data) {
        const newPosts = response.data.content;

        if (isRefresh || page === 0) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }

        setHasMore(!response.data.last);
        setCurrentPage(page);
      }
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to load posts",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(0);
  }, []);

  const handleRefresh = () => {
    fetchPosts(0, true);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchPosts(currentPage + 1);
    }
  };

  const handleCommentPress = (postId: number) => {
    router.push(`/social/${postId}`);
  };

  const renderPost = useCallback(
    ({ item }: { item: Post }) => (
      <PostCart
        post={item}
        onCommentPress={() => handleCommentPress(item.id)}
        onPostUpdate={handleRefresh}
        isDark={isDark}
      />
    ),
    [isDark]
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator
          size="small"
          color={isDark ? "#00b894" : "#7f27ff"}
        />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text
          className={`text-base ${isDark ? "text-text-secondary" : "text-text-muted"}`}
        >
          No posts yet. Be the first to share!
        </Text>
      </View>
    );
  };

  return (
    <View
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      } px-8 pt-4`}
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

      <View className="flex-1">
        {/* My Group Navigation Button */}
        <TouchableOpacity
          className={`mb-4 p-4 rounded-2xl items-center ${isDark ? "bg-primary-dark shadow-lg" : "bg-primary shadow-md"}`}
          onPress={() => router.push("/social/groups/groups")}
        >
          <Text
            className={`text-base font-medium ${isDark ? "text-text-primary" : "text-text-dark"}`}
          >
            My Groups
          </Text>
        </TouchableOpacity>

        {/* Create Post Card */}
        <View
          className={`flex-row items-center rounded-2xl p-4 mb-4 ${isDark ? "bg-surface-dark shadow-lg" : "bg-card-light shadow-md"} gap-4`}
        >
          <View className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              source={
                profile?.avatarUrl
                  ? { uri: profile.avatarUrl }
                  : require("../../assets/images/person.png")
              }
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <TouchableOpacity
              className="p-3 border border-border-light rounded-full"
              onPress={() => router.push("/social/create-post")}
            >
              <Text
                className={`${isDark ? "text-text-primary/50" : "text-text-dark/50"} text-base text-center`}
              >
                What's on your mind?
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Posts List */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color={isDark ? "#00b894" : "#7f27ff"}
            />
            <Text
              className={`mt-4 text-base ${isDark ? "text-text-secondary" : "text-text-muted"}`}
            >
              Loading posts...
            </Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={isDark ? "#00b894" : "#7f27ff"}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            ItemSeparatorComponent={() => <View className="h-4" />}
          />
        )}
      </View>

      <Toast />
    </View>
  );
}
