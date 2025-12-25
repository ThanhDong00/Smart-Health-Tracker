import MenuSection from "@/components/ui/account/menu-section";
import SettingItem from "@/components/ui/account/setting-item";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack } from "expo-router";
import { Alert, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";

export default function SettingsScreen() {
  const { isDark } = useTheme();
  const { signOut, isLoading } = useAuth();

  const logoutHandle = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/welcome");
          } catch (error: any) {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: error.message || "Failed to logout",
            });
          }
        },
      },
    ]);
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
          title: "Settings",
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
        <View className="gap-4">
          <MenuSection isDark={isDark}>
            <SettingItem
              label="Sedentary Detection"
              onPress={() => {
                router.push("/settings/sedentary-setting");
              }}
              isDark={isDark}
            >
              <MaterialIcons
                name="airline-seat-recline-normal"
                size={24}
                color={isDark ? "#00b894" : "#7f27ff"}
              />
            </SettingItem>
          </MenuSection>

          <MenuSection isDark={isDark}>
            <SettingItem
              label="Personal Info"
              onPress={() => router.push("/settings/personal-infor")}
              isDark={isDark}
            >
              <MaterialIcons
                name="person"
                size={24}
                color={isDark ? "#00b894" : "#7f27ff"}
              />
            </SettingItem>

            <SettingItem
              label="App Appearance"
              onPress={() => router.push("/settings/appearance")}
              isDark={isDark}
            >
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={24}
                color={isDark ? "#00b894" : "#7f27ff"}
              />
            </SettingItem>

            <SettingItem
              label="Linked Accounts"
              onPress={() => {}}
              isDark={isDark}
            >
              <MaterialIcons
                name="link"
                size={24}
                color={isDark ? "#00b894" : "#7f27ff"}
              />
            </SettingItem>

            <SettingItem
              label="Help & Support"
              onPress={() => {}}
              isDark={isDark}
            >
              <MaterialIcons
                name="help-outline"
                size={24}
                color={isDark ? "#00b894" : "#7f27ff"}
              />
            </SettingItem>

            <SettingItem
              label="Logout"
              onPress={logoutHandle}
              isDark={isDark}
              isDestructive
            >
              <MaterialIcons name="logout" size={24} color="#ef4444" />
            </SettingItem>
          </MenuSection>
        </View>
      </ScrollView>
    </View>
  );
}
