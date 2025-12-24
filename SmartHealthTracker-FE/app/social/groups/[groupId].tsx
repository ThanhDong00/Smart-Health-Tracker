import PostCart from "@/components/ui/social/post-card";
import { useTheme } from "@/hooks/useTheme";
import { Post } from "@/services/social.service";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Mock Group Data
const MOCK_GROUP = {
  id: 1,
  name: "Fitness Lovers",
  avatarUrl:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
  memberCount: 45,
  description: "A community for fitness enthusiasts to share workouts and tips",
};

// Mock Posts Data
const MOCK_GROUP_POSTS: Post[] = [
  {
    id: 101,
    user: {
      id: "1",
      fullName: "Sarah Johnson",
      avatarUrl: "https://i.pravatar.cc/300?img=10",
    },
    content:
      "Just completed a 10k run this morning! The weather was perfect. Who else is training for the marathon?",
    imageUrl:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likeCount: 15,
    commentCount: 8,
    likedByMe: false,
  },
  {
    id: 102,
    user: {
      id: "2",
      fullName: "Mike Chen",
      avatarUrl: "https://i.pravatar.cc/300?img=12",
    },
    content:
      "New PR on deadlifts today! 💪 Consistency is key. Keep grinding everyone!",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likeCount: 23,
    commentCount: 5,
    likedByMe: true,
  },
  {
    id: 103,
    user: {
      id: "3",
      fullName: "Emily Davis",
      avatarUrl: "https://i.pravatar.cc/300?img=15",
    },
    content:
      "Tried a new HIIT workout today. My legs are already feeling it 😅 Link to the workout in comments!",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likeCount: 31,
    commentCount: 12,
    likedByMe: false,
  },
];

export default function GroupDetailsScreen() {
  const { isDark } = useTheme();
  const { groupId } = useLocalSearchParams();
  const [posts, setPosts] = useState<Post[]>(MOCK_GROUP_POSTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      Toast.show({
        type: "success",
        text1: "Refreshed",
        text2: "Posts updated successfully",
      });
    }, 1000);
  };

  const handleCommentPress = (postId: number) => {
    router.push(`/social/${postId}`);
  };

  const handleCreatePost = () => {
    router.push("/social/create-post");
  };

  const handleMenuPress = () => {
    setShowMenuModal(true);
  };

  const handleViewMembers = () => {
    setShowMenuModal(false);
    router.push(`/social/groups/${groupId}/members`);
  };

  const handleInviteFriends = () => {
    setShowMenuModal(false);
    router.push(`/social/groups/${groupId}/invite`);
  };

  const handleLeaveGroup = () => {
    setShowMenuModal(false);
    setShowLeaveConfirmModal(true);
  };

  const confirmLeaveGroup = () => {
    setShowLeaveConfirmModal(false);
    Toast.show({
      type: "success",
      text1: "Left Group",
      text2: "You have left the group",
    });
    setTimeout(() => router.back(), 500);
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

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-6xl mb-4">📝</Text>
      <Text
        className={`text-lg font-medium ${isDark ? "text-text-primary" : "text-text-dark"}`}
      >
        No posts yet
      </Text>
      <Text
        className={`text-sm mt-2 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
      >
        Be the first to share something!
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      }`}
      edges={[]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: MOCK_GROUP.name,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: isDark ? "#0f0f23" : "#f8fafc",
          },
          headerTintColor: isDark ? "#ffffff" : "#1e293b",
          headerRight: () => (
            <TouchableOpacity onPress={handleMenuPress} className="mr-4">
              <MaterialIcons
                name="more-vert"
                size={24}
                color={isDark ? "#ffffff" : "#1e293b"}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <View className="flex-1 px-8 pt-4">
        {/* Group Header */}
        <View
          className={`rounded-2xl p-4 mb-4 ${isDark ? "bg-surface-dark shadow-lg" : "bg-card-light shadow-md"}`}
        >
          <View className="flex-row items-center">
            {/* Group Avatar */}
            <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
              <Image
                source={{ uri: MOCK_GROUP.avatarUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* Group Info */}
            <View className="flex-1 ml-4">
              <Text
                className={`text-xl font-bold ${isDark ? "text-text-primary" : "text-text-dark"}`}
              >
                {MOCK_GROUP.name}
              </Text>
              <Text
                className={`text-sm mt-1 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
              >
                {MOCK_GROUP.memberCount} members
              </Text>
            </View>
          </View>
        </View>

        {/* Create Post Card */}
        <View
          className={`flex-row items-center rounded-2xl p-4 mb-4 ${isDark ? "bg-surface-dark shadow-lg" : "bg-card-light shadow-md"} gap-4`}
        >
          <View className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              source={{ uri: "https://i.pravatar.cc/300" }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <TouchableOpacity
              className="p-3 border border-border-light rounded-full"
              onPress={handleCreatePost}
            >
              <Text
                className={`${isDark ? "text-text-primary/50" : "text-text-dark/50"} text-base text-center`}
              >
                Share with the group...
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
            ListEmptyComponent={renderEmpty}
            ItemSeparatorComponent={() => <View className="h-4" />}
          />
        )}
      </View>

      {/* Group Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMenuModal}
        onRequestClose={() => setShowMenuModal(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setShowMenuModal(false)}
        >
          <Pressable
            className={`rounded-t-3xl p-6 ${isDark ? "bg-surface-dark" : "bg-white"}`}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="items-center mb-2">
              <View
                className={`w-12 h-1 rounded-full ${isDark ? "bg-surface-variant-dark" : "bg-gray-300"}`}
              />
            </View>
            <Text
              className={`text-xl font-bold mb-6 ${isDark ? "text-text-primary" : "text-text-dark"}`}
            >
              Group Options
            </Text>

            {/* Menu Items */}
            <View className="gap-2">
              {/* View Members */}
              <TouchableOpacity
                onPress={handleViewMembers}
                className={`flex-row items-center p-4 rounded-xl ${isDark ? "bg-surface-variant-dark/50" : "bg-gray-100"}`}
              >
                <MaterialIcons
                  name="group"
                  size={24}
                  color={isDark ? "#00b894" : "#7f27ff"}
                />
                <Text
                  className={`text-base font-medium ml-4 ${isDark ? "text-text-primary" : "text-text-dark"}`}
                >
                  View Members
                </Text>
              </TouchableOpacity>

              {/* Invite Friends */}
              <TouchableOpacity
                onPress={handleInviteFriends}
                className={`flex-row items-center p-4 rounded-xl ${isDark ? "bg-surface-variant-dark/50" : "bg-gray-100"}`}
              >
                <MaterialIcons
                  name="person-add"
                  size={24}
                  color={isDark ? "#00b894" : "#7f27ff"}
                />
                <Text
                  className={`text-base font-medium ml-4 ${isDark ? "text-text-primary" : "text-text-dark"}`}
                >
                  Invite Friends
                </Text>
              </TouchableOpacity>

              {/* Leave Group */}
              <TouchableOpacity
                onPress={handleLeaveGroup}
                className={`flex-row items-center p-4 rounded-xl ${isDark ? "bg-red-500/10" : "bg-red-50"}`}
              >
                <MaterialIcons name="exit-to-app" size={24} color="#ef4444" />
                <Text className="text-base font-medium ml-4 text-red-500">
                  Leave Group
                </Text>
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={() => setShowMenuModal(false)}
              className="mt-6 p-4 rounded-xl border border-border-light"
            >
              <Text
                className={`text-base font-semibold text-center ${isDark ? "text-text-secondary" : "text-text-dark"}`}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Leave Confirm Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLeaveConfirmModal}
        onRequestClose={() => setShowLeaveConfirmModal(false)}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/50 px-8"
          onPress={() => setShowLeaveConfirmModal(false)}
        >
          <Pressable
            className={`w-full rounded-3xl p-6 ${isDark ? "bg-surface-dark" : "bg-white"}`}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <View className="items-center mb-4">
              <View
                className={`w-16 h-16 rounded-full items-center justify-center ${isDark ? "bg-red-500/20" : "bg-red-100"}`}
              >
                <MaterialIcons name="exit-to-app" size={32} color="#ef4444" />
              </View>
            </View>

            {/* Title */}
            <Text
              className={`text-xl font-bold text-center mb-2 ${isDark ? "text-text-primary" : "text-text-dark"}`}
            >
              Leave Group?
            </Text>

            {/* Message */}
            <Text
              className={`text-base text-center mb-6 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
            >
              Are you sure you want to leave {MOCK_GROUP.name}? You can always
              rejoin later.
            </Text>

            {/* Buttons */}
            <View className="gap-3">
              <TouchableOpacity
                onPress={confirmLeaveGroup}
                className="bg-red-500 p-4 rounded-xl"
              >
                <Text className="text-base font-semibold text-center text-white">
                  Yes, Leave Group
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowLeaveConfirmModal(false)}
                className={`p-4 rounded-xl border ${isDark ? "border-border-light" : "border-gray-300"}`}
              >
                <Text
                  className={`text-base font-semibold text-center ${isDark ? "text-text-secondary" : "text-text-dark"}`}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Toast />
    </SafeAreaView>
  );
}
