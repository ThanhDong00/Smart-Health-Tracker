import { useTheme } from "@/hooks/useTheme";
import { GroupMember, socialService } from "@/services/social.service";
import { useUserStore } from "@/store/user.store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function GroupMembersScreen() {
  const { isDark } = useTheme();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { profile } = useUserStore();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<GroupMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Fetch group members
  const fetchMembers = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);

      const response = await socialService.getGroupMembers(Number(groupId));

      if (response.data) {
        setMembers(response.data);
        setFilteredMembers(response.data);

        // Find current user's role
        const currentMember = response.data.find(
          (m) => m.user.id === Number(profile?.id)
        );
        if (currentMember) {
          setCurrentUserRole(currentMember.role);
        }
      }
    } catch (error: any) {
      console.error("Error fetching members:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to load members",
      });
    } finally {
      if (showLoading) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter((member) =>
        member.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMembers(false);
  };

  // Format date
  const formatJoinedDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `Joined ${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  // Handle remove member
  const handleRemoveMember = (member: GroupMember) => {
    // Check if current user can remove
    if (currentUserRole !== "OWNER" && currentUserRole !== "ADMIN") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "Only owners and admins can remove members",
      });
      return;
    }

    // Can't remove owner
    if (member.role === "OWNER") {
      Toast.show({
        type: "error",
        text1: "Cannot Remove",
        text2: "Group owner cannot be removed",
      });
      return;
    }

    // Can't remove yourself
    if (member.user.id === Number(profile?.id)) {
      Toast.show({
        type: "error",
        text1: "Cannot Remove",
        text2: "You cannot remove yourself",
      });
      return;
    }

    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${member.user.fullName} from this group?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await socialService.removeMember(Number(groupId), member.user.id);

              // Remove from local state
              setMembers((prev) =>
                prev.filter((m) => m.user.id !== member.user.id)
              );

              Toast.show({
                type: "success",
                text1: "Member Removed",
                text2: `${member.user.fullName} has been removed`,
              });
            } catch (error: any) {
              console.error("Error removing member:", error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2:
                  error?.response?.data?.message || "Failed to remove member",
              });
            }
          },
        },
      ]
    );
  };

  // Separate members by role
  const owners = filteredMembers.filter((m) => m.role === "OWNER");
  const admins = filteredMembers.filter((m) => m.role === "ADMIN");
  const regularMembers = filteredMembers.filter((m) => m.role === "MEMBER");
  const sortedMembers = [...owners, ...admins, ...regularMembers];

  const renderMember = ({ item }: { item: GroupMember }) => (
    <View
      className={`flex-row items-center p-4 rounded-2xl mb-3 ${
        isDark ? "bg-surface-dark shadow-lg" : "bg-card-light shadow-md"
      }`}
    >
      {/* Avatar */}
      <View className="w-14 h-14 rounded-full overflow-hidden">
        <Image
          source={
            item.user.avatarUrl
              ? { uri: item.user.avatarUrl }
              : require("../../../../assets/images/person.png")
          }
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Member Info */}
      <View className="flex-1 ml-4">
        <View className="flex-row items-center gap-2">
          <Text
            className={`text-base font-semibold ${
              isDark ? "text-text-primary" : "text-text-dark"
            }`}
          >
            {item.user.fullName}
          </Text>
          {item.role === "OWNER" && (
            <View
              className={`px-2 py-1 rounded-full ${
                isDark ? "bg-primary-dark/20" : "bg-primary/20"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isDark ? "text-primary-dark" : "text-primary"
                }`}
              >
                OWNER
              </Text>
            </View>
          )}
        </View>
        <Text
          className={`text-sm mt-1 ${
            isDark ? "text-text-secondary" : "text-text-muted"
          }`}
        >
          {formatJoinedDate(item.joinedAt)}
        </Text>
      </View>

      {/* Remove Button (only for owner/admin, not for owner members) */}
      {(currentUserRole === "OWNER" || currentUserRole === "ADMIN") &&
        item.role !== "OWNER" &&
        item.user.id !== Number(profile?.id) && (
          <TouchableOpacity
            onPress={() => handleRemoveMember(item)}
            className={`p-2 rounded-full ${
              isDark ? "bg-red-500/10" : "bg-red-50"
            }`}
          >
            <MaterialIcons name="person-remove" size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <MaterialIcons
        name="search-off"
        size={64}
        color={isDark ? "#6b7280" : "#9ca3af"}
      />
      <Text
        className={`text-lg font-medium mt-4 ${
          isDark ? "text-text-primary" : "text-text-dark"
        }`}
      >
        No members found
      </Text>
      <Text
        className={`text-sm mt-2 ${
          isDark ? "text-text-secondary" : "text-text-muted"
        }`}
      >
        Try a different search term
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
          title: "Members",
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

      <View className="flex-1 px-8 pt-4">
        {/* Search Bar */}
        <View
          className={`flex-row items-center rounded-xl px-4 py-3 mb-4 ${
            isDark
              ? "bg-surface-dark border border-surface-variant-dark"
              : "bg-white border border-gray-200"
          }`}
        >
          <MaterialIcons
            name="search"
            size={20}
            color={isDark ? "#9ca3af" : "#6b7280"}
          />
          <TextInput
            className={`flex-1 ml-3 text-base ${
              isDark ? "text-text-primary" : "text-text-dark"
            }`}
            placeholder="Search members..."
            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcons
                name="close"
                size={20}
                color={isDark ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Member Count */}
        {!isLoading && (
          <Text
            className={`text-sm mb-3 ${
              isDark ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            {filteredMembers.length}{" "}
            {filteredMembers.length === 1 ? "member" : "members"}
          </Text>
        )}

        {/* Members List */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color={isDark ? "#00b894" : "#7f27ff"}
            />
            <Text
              className={`mt-4 text-base ${
                isDark ? "text-text-secondary" : "text-text-muted"
              }`}
            >
              Loading members...
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedMembers}
            renderItem={renderMember}
            keyExtractor={(item) => item.user.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={isDark ? "#00b894" : "#7f27ff"}
              />
            }
            ListEmptyComponent={renderEmpty}
          />
        )}
      </View>

      <Toast />
    </SafeAreaView>
  );
}
