import { useTheme } from "@/hooks/useTheme";
import {
  Group,
  GroupInvitation,
  socialService,
} from "@/services/social.service";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
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

export default function GroupsScreen() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<"joined" | "invited">("joined");
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch my groups
  const fetchMyGroups = async () => {
    try {
      const response = await socialService.getMyGroups();
      if (response.data) {
        setJoinedGroups(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching my groups:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to load groups",
      });
    }
  };

  // Fetch pending invitations
  const fetchPendingInvitations = async () => {
    try {
      const response = await socialService.getPendingInvitations();
      if (response.data) {
        setInvitations(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching invitations:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to load invitations",
      });
    }
  };

  // Fetch all data
  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      await Promise.all([fetchMyGroups(), fetchPendingInvitations()]);
    } finally {
      if (showLoading) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData(false);
  };

  const handleAcceptInvitation = async (inviteId: number) => {
    try {
      const invitation = invitations.find((inv) => inv.inviteId === inviteId);

      await socialService.acceptInvitation(inviteId);

      // Refresh data after accepting
      await fetchData(false);

      Toast.show({
        type: "success",
        text1: "Accepted",
        text2: `You joined ${invitation?.groupName || "the group"}`,
      });
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to accept invitation",
      });
    }
  };

  const handleDeclineInvitation = async (inviteId: number) => {
    try {
      const invitation = invitations.find((inv) => inv.inviteId === inviteId);

      await socialService.declineInvitation(inviteId);

      // Remove from local state
      setInvitations((prev) => prev.filter((inv) => inv.inviteId !== inviteId));

      Toast.show({
        type: "info",
        text1: "Declined",
        text2: `Invitation to ${invitation?.groupName || "the group"} declined`,
      });
    } catch (error: any) {
      console.error("Error declining invitation:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to decline invitation",
      });
    }
  };

  const handleGroupPress = (groupId: number) => {
    router.push(`/social/groups/${groupId}`);
  };

  const handleCreateGroup = () => {
    router.push("/social/groups/create-group");
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
            source={require("../../../assets/images/group.png")}
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
            {item.memberCount} members
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
            source={require("../../../assets/images/group.png")}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Group Info */}
        <View className="flex-1 ml-4">
          <Text
            className={`text-lg font-semibold ${isDark ? "text-text-primary" : "text-text-dark"}`}
          >
            {item.groupName}
          </Text>
          {item.groupDescription && (
            <Text
              className={`text-sm mt-1 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
              numberOfLines={2}
            >
              {item.groupDescription}
            </Text>
          )}
        </View>
      </View>

      {/* Invited By */}
      <View className="flex-row items-center mb-3">
        <Image
          source={
            item.invitedBy.avatarUrl
              ? { uri: item.invitedBy.avatarUrl }
              : require("../../../assets/images/person.png")
          }
          className="w-6 h-6 rounded-full"
        />
        <Text
          className={`text-sm ml-2 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
        >
          Invited by {item.invitedBy.fullName} • {formatDate(item.createdAt)}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => handleAcceptInvitation(item.inviteId)}
          className={`flex-1 py-3 rounded-xl ${isDark ? "bg-primary-dark" : "bg-primary"}`}
        >
          <Text
            className={`text-center font-semibold ${isDark ? "text-text-primary" : "text-white"}`}
          >
            Accept
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeclineInvitation(item.inviteId)}
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
    // <SafeAreaView
    //   className={`flex-1 ${
    //     isDark ? "bg-background-dark" : "bg-background-light"
    //   }`}
    //   edges={["top"]}
    // >
    <View
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      }`}
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
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator
                size="large"
                color={isDark ? "#00b894" : "#7f27ff"}
              />
            </View>
          ) : activeTab === "joined" ? (
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
              keyExtractor={(item) => item.inviteId.toString()}
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
    </View>

    // </SafeAreaView>
  );
}
