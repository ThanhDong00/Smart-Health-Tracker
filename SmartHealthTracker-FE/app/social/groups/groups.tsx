import { useTheme } from "@/hooks/useTheme";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Mock data types
interface Group {
  id: number;
  name: string;
  avatarUrl: string;
  memberCount: number;
  postCount: number;
  isPrivate: boolean;
}

interface GroupInvitation {
  id: number;
  group: Group;
  invitedBy: {
    name: string;
    avatar: string;
  };
  invitedAt: string;
}

// Mock data
const MOCK_JOINED_GROUPS: Group[] = [
  {
    id: 1,
    name: "Fitness Lovers",
    avatarUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    memberCount: 45,
    postCount: 128,
    isPrivate: false,
  },
  {
    id: 2,
    name: "Gym Buddies",
    avatarUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    memberCount: 23,
    postCount: 67,
    isPrivate: true,
  },
  {
    id: 3,
    name: "Morning Runners",
    avatarUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400",
    memberCount: 89,
    postCount: 234,
    isPrivate: false,
  },
  {
    id: 4,
    name: "Yoga & Meditation",
    avatarUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    memberCount: 56,
    postCount: 145,
    isPrivate: false,
  },
];

const MOCK_INVITATIONS: GroupInvitation[] = [
  {
    id: 1,
    group: {
      id: 5,
      name: "Cycling Team",
      avatarUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400",
      memberCount: 34,
      postCount: 89,
      isPrivate: false,
    },
    invitedBy: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    invitedAt: "2h ago",
  },
  {
    id: 2,
    group: {
      id: 6,
      name: "Healthy Eating",
      avatarUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
      memberCount: 78,
      postCount: 201,
      isPrivate: true,
    },
    invitedBy: {
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/100?img=2",
    },
    invitedAt: "1d ago",
  },
];

export default function GroupsScreen() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<"joined" | "invited">("joined");
  const [joinedGroups, setJoinedGroups] = useState<Group[]>(
    MOCK_JOINED_GROUPS
  );
  const [invitations, setInvitations] =
    useState<GroupInvitation[]>(MOCK_INVITATIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      Toast.show({
        type: "success",
        text1: "Refreshed",
        text2: "Groups updated successfully",
      });
    }, 1000);
  };

  const handleAcceptInvitation = (invitationId: number) => {
    const invitation = invitations.find((inv) => inv.id === invitationId);
    if (invitation) {
      setJoinedGroups((prev) => [...prev, invitation.group]);
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      Toast.show({
        type: "success",
        text1: "Accepted",
        text2: `You joined ${invitation.group.name}`,
      });
    }
  };

  const handleDeclineInvitation = (invitationId: number) => {
    const invitation = invitations.find((inv) => inv.id === invitationId);
    setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    Toast.show({
      type: "info",
      text1: "Declined",
      text2: `Invitation to ${invitation?.group.name} declined`,
    });
  };

  const handleGroupPress = (groupId: number) => {
    router.push(`/social/groups/${groupId}`);
  };

  const handleCreateGroup = () => {
    router.push("/social/groups/create-group");
  };

  const renderGroupCard = ({ item }: { item: Group }) => (
    <TouchableOpacity
      onPress={() => handleGroupPress(item.id)}
      className={`rounded-2xl p-4 mb-3 ${isDark ? "bg-surface-dark shadow-lg" : "bg-card-light shadow-md"}`}
    >
      <View className="flex-row items-center">
        {/* Group Avatar */}
        <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
          <Image
            source={{ uri: item.avatarUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Group Info */}
        <View className="flex-1 ml-4">
          <Text
            className={`text-lg font-semibold ${isDark ? "text-text-primary" : "text-text-dark"}`}
          >
            {item.name}
          </Text>
          <Text
            className={`text-sm mt-1 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
          >
            {item.memberCount} members • {item.postCount} posts
          </Text>
        </View>

        {/* Arrow Icon */}
        <Text
          className={`text-xl ${isDark ? "text-text-secondary" : "text-text-muted"}`}
        >
          →
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderInvitationCard = ({ item }: { item: GroupInvitation }) => (
    <View
      className={`rounded-2xl p-4 mb-3 ${isDark ? "bg-surface-dark shadow-lg" : "bg-card-light shadow-md"}`}
    >
      <View className="flex-row items-center mb-3">
        {/* Group Avatar */}
        <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
          <Image
            source={{ uri: item.group.avatarUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Group Info */}
        <View className="flex-1 ml-4">
          <Text
            className={`text-lg font-semibold ${isDark ? "text-text-primary" : "text-text-dark"}`}
          >
            {item.group.name}
          </Text>
          <Text
            className={`text-sm mt-1 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
          >
            {item.group.memberCount} members
          </Text>
        </View>
      </View>

      {/* Invited By */}
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: item.invitedBy.avatar }}
          className="w-6 h-6 rounded-full"
        />
        <Text
          className={`text-sm ml-2 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
        >
          Invited by {item.invitedBy.name} • {item.invitedAt}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => handleAcceptInvitation(item.id)}
          className={`flex-1 py-3 rounded-xl ${isDark ? "bg-primary-dark" : "bg-primary"}`}
        >
          <Text
            className={`text-center font-semibold ${isDark ? "text-text-primary" : "text-white"}`}
          >
            Accept
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeclineInvitation(item.id)}
          className={`flex-1 py-3 rounded-xl ${isDark ? "bg-surface-light/10 border border-border-light" : "bg-gray-100 border border-gray-300"}`}
        >
          <Text
            className={`text-center font-semibold ${isDark ? "text-text-secondary" : "text-text-dark"}`}
          >
            Decline
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-6xl mb-4">
        {activeTab === "joined" ? "👥" : "📬"}
      </Text>
      <Text
        className={`text-lg font-medium ${isDark ? "text-text-primary" : "text-text-dark"}`}
      >
        {activeTab === "joined" ? "No groups yet" : "No invitations"}
      </Text>
      <Text
        className={`text-sm mt-2 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
      >
        {activeTab === "joined"
          ? "Create or join a group to get started"
          : "You don't have any pending invitations"}
      </Text>
    </View>
  );

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
          title: "My Groups",
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
        {/* Tabs */}
        <View
          className={`flex-row mx-8 mt-4 p-1 rounded-xl ${isDark ? "bg-surface-dark" : "bg-gray-100"}`}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("joined")}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === "joined"
                ? isDark
                  ? "bg-primary-dark"
                  : "bg-primary"
                : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "joined"
                  ? isDark
                    ? "text-text-primary"
                    : "text-white"
                  : isDark
                    ? "text-text-secondary"
                    : "text-text-muted"
              }`}
            >
              Joined ({joinedGroups.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("invited")}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === "invited"
                ? isDark
                  ? "bg-primary-dark"
                  : "bg-primary"
                : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "invited"
                  ? isDark
                    ? "text-text-primary"
                    : "text-white"
                  : isDark
                    ? "text-text-secondary"
                    : "text-text-muted"
              }`}
            >
              Invited ({invitations.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 px-8 pt-4">
          {activeTab === "joined" ? (
            <FlatList
              data={joinedGroups}
              renderItem={renderGroupCard}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={isDark ? "#00b894" : "#7f27ff"}
                />
              }
              ListEmptyComponent={renderEmptyState}
            />
          ) : (
            <FlatList
              data={invitations}
              renderItem={renderInvitationCard}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={isDark ? "#00b894" : "#7f27ff"}
                />
              }
              ListEmptyComponent={renderEmptyState}
            />
          )}
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={handleCreateGroup}
          className={`absolute bottom-8 right-8 w-16 h-16 rounded-full items-center justify-center shadow-lg ${isDark ? "bg-primary-dark" : "bg-primary"}`}
          style={{
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          }}
        >
          <Text
            className={`text-3xl ${isDark ? "text-text-primary" : "text-white"}`}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </SafeAreaView>
  );
}
