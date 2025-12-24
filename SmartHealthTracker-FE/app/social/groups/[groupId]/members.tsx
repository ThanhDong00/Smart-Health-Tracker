import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock Member Data
interface Member {
  id: string;
  fullName: string;
  avatarUrl: string;
  role: "admin" | "member";
  joinedAt: string;
}

const MOCK_MEMBERS: Member[] = [
  // Admins
  {
    id: "1",
    fullName: "John Doe",
    avatarUrl: "https://i.pravatar.cc/300?img=1",
    role: "admin",
    joinedAt: "6 months ago",
  },
  {
    id: "2",
    fullName: "Sarah Johnson",
    avatarUrl: "https://i.pravatar.cc/300?img=10",
    role: "admin",
    joinedAt: "6 months ago",
  },
  // Members
  {
    id: "3",
    fullName: "Mike Chen",
    avatarUrl: "https://i.pravatar.cc/300?img=12",
    role: "member",
    joinedAt: "5 months ago",
  },
  {
    id: "4",
    fullName: "Emily Davis",
    avatarUrl: "https://i.pravatar.cc/300?img=15",
    role: "member",
    joinedAt: "4 months ago",
  },
  {
    id: "5",
    fullName: "Alex Thompson",
    avatarUrl: "https://i.pravatar.cc/300?img=20",
    role: "member",
    joinedAt: "3 months ago",
  },
  {
    id: "6",
    fullName: "Jessica Lee",
    avatarUrl: "https://i.pravatar.cc/300?img=25",
    role: "member",
    joinedAt: "3 months ago",
  },
  {
    id: "7",
    fullName: "David Brown",
    avatarUrl: "https://i.pravatar.cc/300?img=30",
    role: "member",
    joinedAt: "2 months ago",
  },
  {
    id: "8",
    fullName: "Lisa Anderson",
    avatarUrl: "https://i.pravatar.cc/300?img=35",
    role: "member",
    joinedAt: "2 months ago",
  },
  {
    id: "9",
    fullName: "James Wilson",
    avatarUrl: "https://i.pravatar.cc/300?img=40",
    role: "member",
    joinedAt: "1 month ago",
  },
  {
    id: "10",
    fullName: "Maria Garcia",
    avatarUrl: "https://i.pravatar.cc/300?img=45",
    role: "member",
    joinedAt: "1 month ago",
  },
  {
    id: "11",
    fullName: "Robert Taylor",
    avatarUrl: "https://i.pravatar.cc/300?img=50",
    role: "member",
    joinedAt: "3 weeks ago",
  },
  {
    id: "12",
    fullName: "Jennifer Martinez",
    avatarUrl: "https://i.pravatar.cc/300?img=55",
    role: "member",
    joinedAt: "2 weeks ago",
  },
  {
    id: "13",
    fullName: "William Clark",
    avatarUrl: "https://i.pravatar.cc/300?img=60",
    role: "member",
    joinedAt: "2 weeks ago",
  },
  {
    id: "14",
    fullName: "Linda Rodriguez",
    avatarUrl: "https://i.pravatar.cc/300?img=65",
    role: "member",
    joinedAt: "1 week ago",
  },
  {
    id: "15",
    fullName: "Michael White",
    avatarUrl: "https://i.pravatar.cc/300?img=70",
    role: "member",
    joinedAt: "5 days ago",
  },
  {
    id: "16",
    fullName: "Patricia Harris",
    avatarUrl: "https://i.pravatar.cc/300?img=75",
    role: "member",
    joinedAt: "3 days ago",
  },
  {
    id: "17",
    fullName: "Christopher Lewis",
    avatarUrl: "https://i.pravatar.cc/300?img=80",
    role: "member",
    joinedAt: "2 days ago",
  },
];

export default function GroupMembersScreen() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter members by search query
  const filteredMembers = MOCK_MEMBERS.filter((member) =>
    member.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const admins = filteredMembers.filter((m) => m.role === "admin");
  const members = filteredMembers.filter((m) => m.role === "member");

  const renderMemberCard = ({ item }: { item: Member }) => (
    <View
      className={`flex-row items-center p-4 mb-3 rounded-2xl ${isDark ? "bg-surface-dark" : "bg-card-light"}`}
    >
      {/* Avatar */}
      <View className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
        <Image
          source={{ uri: item.avatarUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Member Info */}
      <View className="flex-1 ml-4">
        <View className="flex-row items-center gap-2">
          <Text
            className={`text-base font-semibold ${isDark ? "text-text-primary" : "text-text-dark"}`}
          >
            {item.fullName}
          </Text>
          {item.role === "admin" && (
            <View
              className={`px-2 py-1 rounded-full ${isDark ? "bg-primary-dark/20" : "bg-primary/20"}`}
            >
              <Text
                className={`text-xs font-semibold ${isDark ? "text-primary-dark" : "text-primary"}`}
              >
                Admin
              </Text>
            </View>
          )}
        </View>
        <Text
          className={`text-sm mt-1 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
        >
          Joined {item.joinedAt}
        </Text>
      </View>

      {/* Arrow Icon */}
      <MaterialIcons
        name="chevron-right"
        size={24}
        color={isDark ? "#6b7280" : "#9ca3af"}
      />
    </View>
  );

  const renderSectionHeader = (title: string, count: number) => (
    <View className="mb-3 mt-2">
      <Text
        className={`text-lg font-bold ${isDark ? "text-text-primary" : "text-text-dark"}`}
      >
        {title} ({count})
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <MaterialIcons
        name="search-off"
        size={64}
        color={isDark ? "#6b7280" : "#9ca3af"}
      />
      <Text
        className={`text-lg font-medium mt-4 ${isDark ? "text-text-primary" : "text-text-dark"}`}
      >
        No members found
      </Text>
      <Text
        className={`text-sm mt-2 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
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
          title: `Members (${MOCK_MEMBERS.length})`,
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
          className={`flex-row items-center rounded-xl px-4 mb-4 ${isDark ? "bg-surface-dark border border-surface-variant-dark" : "bg-white border border-gray-200"}`}
        >
          <MaterialIcons
            name="search"
            size={20}
            color={isDark ? "#6b7280" : "#9ca3af"}
          />
          <TextInput
            className={`flex-1 py-3 px-3 text-base ${isDark ? "text-text-primary" : "text-text-dark"}`}
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
                color={isDark ? "#6b7280" : "#9ca3af"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Members List */}
        {filteredMembers.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={[
              { type: "header", key: "admins-header" },
              ...admins.map((m) => ({ type: "admin", key: m.id, data: m })),
              { type: "header", key: "members-header" },
              ...members.map((m) => ({ type: "member", key: m.id, data: m })),
            ]}
            renderItem={({ item }) => {
              if (item.type === "header") {
                if (item.key === "admins-header" && admins.length > 0) {
                  return renderSectionHeader("Admins", admins.length);
                }
                if (item.key === "members-header" && members.length > 0) {
                  return renderSectionHeader("Members", members.length);
                }
                return null;
              }
              return renderMemberCard({ item: item.data as Member });
            }}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
