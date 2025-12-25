import PrimaryButton from "@/components/primary-button";
import { useTheme } from "@/hooks/useTheme";
import { InviteSearchResult, socialService } from "@/services/social.service";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const RELATION_OPTIONS = [
  { label: "Other", value: "OTHER" },
  { label: "Father", value: "FATHER" },
  { label: "Mother", value: "MOTHER" },
  { label: "Brother", value: "BROTHER" },
  { label: "Sister", value: "SISTER" },
];

export default function InviteFriendsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<InviteSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<InviteSearchResult | null>(
    null
  );
  const [showRelationModal, setShowRelationModal] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState("OTHER");
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search users with debounce
  const searchUsers = async (query: string) => {
    if (query.length < 5) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await socialService.searchUsersForInvite(
        Number(groupId),
        query
      );

      if (response.data) {
        // Filter out users who are already members or have pending invites
        const availableUsers = response.data.filter(
          (user) => !user.alreadyMember && !user.pendingInvited
        );
        setSearchResults(availableUsers);
      }
    } catch (error: any) {
      console.error("Error searching users:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to search users",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debounce
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    if (text.length >= 5) {
      debounceTimer.current = setTimeout(() => {
        searchUsers(text);
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Handle user selection
  const handleUserSelect = (user: InviteSearchResult) => {
    setSelectedUser(user);
    setSelectedRelation("OTHER");
    setShowRelationModal(true);
  };

  // Send invitation
  const handleSendInvite = async () => {
    if (!selectedUser) return;

    try {
      setIsSendingInvite(true);
      const response = await socialService.sendGroupInvite(Number(groupId), {
        invitedUserId: selectedUser.user.id,
        relation: selectedRelation,
      });

      if (response.data) {
        Toast.show({
          type: "success",
          text1: "Invitation Sent",
          text2: `Invitation sent to ${selectedUser.user.fullName}`,
        });

        // Remove from search results
        setSearchResults((prev) =>
          prev.filter((u) => u.user.id !== selectedUser.user.id)
        );

        // Reset
        setShowRelationModal(false);
        setSelectedUser(null);
        setSearchQuery("");
      }
    } catch (error: any) {
      console.error("Error sending invite:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to send invitation",
      });
    } finally {
      setIsSendingInvite(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const renderUserCard = ({ item }: { item: InviteSearchResult }) => (
    <TouchableOpacity
      onPress={() => handleUserSelect(item)}
      className={`flex-row items-center p-4 mb-3 rounded-2xl ${isDark ? "bg-surface-dark" : "bg-card-light"}`}
    >
      {/* User Avatar */}
      <View className="w-12 h-12 rounded-full overflow-hidden">
        {item.user.avatarUrl ? (
          <Image
            source={{ uri: item.user.avatarUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View
            className={`w-full h-full items-center justify-center ${isDark ? "bg-primary-dark/20" : "bg-primary/20"}`}
          >
            <MaterialIcons
              name="person"
              size={24}
              color={isDark ? "#00b894" : "#7f27ff"}
            />
          </View>
        )}
      </View>

      {/* User Info */}
      <View className="flex-1 ml-4">
        <Text
          className={`text-base font-semibold ${isDark ? "text-text-primary" : "text-text-dark"}`}
        >
          {item.user.fullName}
        </Text>
        <Text
          className={`text-sm mt-1 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
        >
          {item.email}
        </Text>
      </View>

      {/* Arrow Icon */}
      <MaterialIcons
        name="chevron-right"
        size={24}
        color={isDark ? "#6b7280" : "#9ca3af"}
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (searchQuery.length > 0 && searchQuery.length < 5) {
      return (
        <View className="items-center justify-center py-12">
          <MaterialIcons
            name="search"
            size={48}
            color={isDark ? "#6b7280" : "#9ca3af"}
          />
          <Text
            className={`text-base font-medium mt-4 ${isDark ? "text-text-primary" : "text-text-dark"}`}
          >
            Keep typing...
          </Text>
          <Text
            className={`text-sm mt-2 text-center px-8 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
          >
            Enter at least 5 characters to search
          </Text>
        </View>
      );
    }

    if (searchQuery.length >= 5 && searchResults.length === 0 && !isSearching) {
      return (
        <View className="items-center justify-center py-12">
          <MaterialIcons
            name="person-search"
            size={48}
            color={isDark ? "#6b7280" : "#9ca3af"}
          />
          <Text
            className={`text-base font-medium mt-4 ${isDark ? "text-text-primary" : "text-text-dark"}`}
          >
            No users found
          </Text>
          <Text
            className={`text-sm mt-2 text-center px-8 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
          >
            Try searching with a different email
          </Text>
        </View>
      );
    }

    return (
      <View className="items-center justify-center py-12">
        <MaterialIcons
          name="person-add"
          size={48}
          color={isDark ? "#6b7280" : "#9ca3af"}
        />
        <Text
          className={`text-base font-medium mt-4 ${isDark ? "text-text-primary" : "text-text-dark"}`}
        >
          Search for friends
        </Text>
        <Text
          className={`text-sm mt-2 text-center px-8 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
        >
          Enter an email address to find and invite friends to this group
        </Text>
      </View>
    );
  };

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
          title: "Invite to Group",
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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1">
          {/* Search Input Section */}
          <View className="px-8 pt-6 pb-4">
            <Text
              className={`text-base font-semibold mb-3 ${isDark ? "text-text-primary" : "text-text-dark"}`}
            >
              Search by email
            </Text>

            {/* Search Input */}
            <View
              className={`flex-row items-center rounded-xl px-4 ${isDark ? "bg-surface-dark border border-surface-variant-dark" : "bg-white border border-gray-200"}`}
            >
              <MaterialIcons
                name="search"
                size={20}
                color={isDark ? "#6b7280" : "#9ca3af"}
              />
              <TextInput
                className={`flex-1 py-3 px-3 text-base ${isDark ? "text-text-primary" : "text-text-dark"}`}
                placeholder="Enter email address (min 5 chars)"
                placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                value={searchQuery}
                onChangeText={handleSearchChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <MaterialIcons
                    name="close"
                    size={20}
                    color={isDark ? "#6b7280" : "#9ca3af"}
                  />
                </TouchableOpacity>
              )}
              {isSearching && (
                <ActivityIndicator
                  size="small"
                  color={isDark ? "#00b894" : "#7f27ff"}
                  style={{ marginLeft: 8 }}
                />
              )}
            </View>
          </View>

          {/* Search Results */}
          <View className="flex-1 px-8">
            {searchResults.length > 0 ? (
              <>
                <Text
                  className={`text-lg font-bold mb-3 ${isDark ? "text-text-primary" : "text-text-dark"}`}
                >
                  Search Results
                </Text>
                <FlatList
                  data={searchResults}
                  renderItem={renderUserCard}
                  keyExtractor={(item) => item.user.id.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 100 }}
                />
              </>
            ) : (
              renderEmptyState()
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Relation Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRelationModal}
        onRequestClose={() => setShowRelationModal(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => !isSendingInvite && setShowRelationModal(false)}
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
              className={`text-xl font-bold mb-2 ${isDark ? "text-text-primary" : "text-text-dark"}`}
            >
              Select Relationship
            </Text>
            <Text
              className={`text-sm mb-6 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
            >
              Inviting {selectedUser?.user.fullName}
            </Text>

            {/* Relation Options */}
            <ScrollView
              className="mb-6"
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 300 }}
            >
              {RELATION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSelectedRelation(option.value)}
                  className={`flex-row items-center justify-between p-4 mb-2 rounded-xl ${
                    selectedRelation === option.value
                      ? isDark
                        ? "bg-primary-dark border-2 border-primary"
                        : "bg-primary border-2 border-primary"
                      : isDark
                        ? "bg-surface-variant-dark border border-surface-variant-dark"
                        : "bg-gray-100 border border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-base font-semibold ${
                      selectedRelation === option.value
                        ? isDark
                          ? "text-text-primary"
                          : "text-white"
                        : isDark
                          ? "text-text-primary"
                          : "text-text-dark"
                    }`}
                  >
                    {option.label}
                  </Text>
                  {selectedRelation === option.value && (
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color={isDark ? "#00b894" : "#ffffff"}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Buttons */}
            <View className="gap-3">
              <PrimaryButton
                title={isSendingInvite ? "Sending..." : "Send Invitation"}
                onPress={handleSendInvite}
                disabled={isSendingInvite}
                isDark={isDark}
              />

              <TouchableOpacity
                onPress={() => setShowRelationModal(false)}
                disabled={isSendingInvite}
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
