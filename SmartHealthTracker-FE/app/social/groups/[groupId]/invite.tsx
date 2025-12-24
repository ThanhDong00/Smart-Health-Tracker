import PrimaryButton from "@/components/primary-button";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Mock Invitation Data
interface Invitation {
  id: string;
  email: string;
  sentAt: string;
}

const MOCK_INVITATIONS: Invitation[] = [
  {
    id: "1",
    email: "john.doe@gmail.com",
    sentAt: "2 days ago",
  },
  {
    id: "2",
    email: "sarah.wilson@email.com",
    sentAt: "1 week ago",
  },
  {
    id: "3",
    email: "mike.chen@yahoo.com",
    sentAt: "2 weeks ago",
  },
];

export default function InviteFriendsScreen() {
  const { isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [pendingInvitations, setPendingInvitations] =
    useState<Invitation[]>(MOCK_INVITATIONS);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendInvitation = () => {
    // Validate email
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter an email address",
      });
      return;
    }

    if (!validateEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address",
      });
      return;
    }

    // Check if already invited
    if (pendingInvitations.some((inv) => inv.email === email)) {
      Toast.show({
        type: "error",
        text1: "Already Invited",
        text2: "This email has already been invited",
      });
      return;
    }

    // Add to pending invitations
    const newInvitation: Invitation = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      sentAt: "Just now",
    };

    setPendingInvitations([newInvitation, ...pendingInvitations]);
    setEmail("");

    Toast.show({
      type: "success",
      text1: "Invitation Sent",
      text2: `Invitation sent to ${newInvitation.email}`,
    });
  };

  const handleCancelInvitation = (invitationId: string) => {
    const invitation = pendingInvitations.find(
      (inv) => inv.id === invitationId
    );
    setPendingInvitations((prev) =>
      prev.filter((inv) => inv.id !== invitationId)
    );

    Toast.show({
      type: "info",
      text1: "Invitation Cancelled",
      text2: `Invitation to ${invitation?.email} has been cancelled`,
    });
  };

  const renderInvitationCard = ({ item }: { item: Invitation }) => (
    <View
      className={`flex-row items-center p-4 mb-3 rounded-2xl ${isDark ? "bg-surface-dark" : "bg-card-light"}`}
    >
      {/* Email Icon */}
      <View
        className={`w-12 h-12 rounded-full items-center justify-center ${isDark ? "bg-primary-dark/20" : "bg-primary/20"}`}
      >
        <MaterialIcons
          name="email"
          size={24}
          color={isDark ? "#00b894" : "#7f27ff"}
        />
      </View>

      {/* Invitation Info */}
      <View className="flex-1 ml-4">
        <Text
          className={`text-base font-semibold ${isDark ? "text-text-primary" : "text-text-dark"}`}
        >
          {item.email}
        </Text>
        <Text
          className={`text-sm mt-1 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
        >
          Sent {item.sentAt}
        </Text>
      </View>

      {/* Cancel Button */}
      <TouchableOpacity
        onPress={() => handleCancelInvitation(item.id)}
        className="w-10 h-10 rounded-full items-center justify-center bg-red-500/10"
      >
        <MaterialIcons name="close" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View className="items-center justify-center py-12">
      <View
        className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${isDark ? "bg-surface-dark" : "bg-gray-100"}`}
      >
        <MaterialIcons
          name="mail-outline"
          size={40}
          color={isDark ? "#6b7280" : "#9ca3af"}
        />
      </View>
      <Text
        className={`text-base font-medium ${isDark ? "text-text-primary" : "text-text-dark"}`}
      >
        No pending invitations
      </Text>
      <Text
        className={`text-sm mt-2 text-center px-8 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
      >
        Invite friends by entering their email address
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
          {/* Email Input Section */}
          <View className="px-8 pt-6 pb-4">
            {/* Label */}
            <Text
              className={`text-base font-semibold mb-3 ${isDark ? "text-text-primary" : "text-text-dark"}`}
            >
              Enter email address
            </Text>

            {/* Email Input */}
            <View
              className={`flex-row items-center rounded-xl px-4 mb-4 ${isDark ? "bg-surface-dark border border-surface-variant-dark" : "bg-white border border-gray-200"}`}
            >
              <MaterialIcons
                name="email"
                size={20}
                color={isDark ? "#6b7280" : "#9ca3af"}
              />
              <TextInput
                className={`flex-1 py-3 px-3 text-base ${isDark ? "text-text-primary" : "text-text-dark"}`}
                placeholder="friend@example.com"
                placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {email.length > 0 && (
                <TouchableOpacity onPress={() => setEmail("")}>
                  <MaterialIcons
                    name="close"
                    size={20}
                    color={isDark ? "#6b7280" : "#9ca3af"}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Send Button */}
            <PrimaryButton
              title="Send Invitation"
              onPress={handleSendInvitation}
              disabled={!email.trim()}
              isDark={isDark}
            />

            {/* Info Card */}
            <View
              className={`flex-row items-start mt-4 p-4 rounded-xl ${isDark ? "bg-primary-dark/10" : "bg-primary/10"}`}
            >
              <MaterialIcons
                name="info"
                size={20}
                color={isDark ? "#00b894" : "#7f27ff"}
                style={{ marginTop: 2 }}
              />
              <Text
                className={`text-sm ml-3 flex-1 ${isDark ? "text-text-secondary" : "text-text-muted"}`}
              >
                An invitation email will be sent to the address you provide.
                They can join the group by accepting the invitation.
              </Text>
            </View>
          </View>

          {/* Pending Invitations Section */}
          <View className="flex-1 px-8">
            <View className="flex-row items-center justify-between mb-3">
              <Text
                className={`text-lg font-bold ${isDark ? "text-text-primary" : "text-text-dark"}`}
              >
                Pending Invitations
              </Text>
              <View
                className={`px-3 py-1 rounded-full ${isDark ? "bg-surface-dark" : "bg-gray-100"}`}
              >
                <Text
                  className={`text-sm font-semibold ${isDark ? "text-text-secondary" : "text-text-muted"}`}
                >
                  {pendingInvitations.length}
                </Text>
              </View>
            </View>

            {pendingInvitations.length === 0 ? (
              renderEmptyState()
            ) : (
              <FlatList
                data={pendingInvitations}
                renderItem={renderInvitationCard}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      <Toast />
    </SafeAreaView>
  );
}
