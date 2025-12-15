import MenuSection from "@/components/ui/account/menu-section";
import SettingItem from "@/components/ui/account/setting-item";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Alert, useColorScheme, View } from "react-native";

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? "light";
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
            Alert.alert("Error", error.message || "Failed to logout");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background p-8 flex-col gap-4">
      <MenuSection>
        <SettingItem label="Sedentary Detection" onPress={() => {}}>
          <MaterialIcons
            name="airline-seat-recline-normal"
            size={24}
            color="black"
          />
        </SettingItem>
      </MenuSection>

      <MenuSection>
        <SettingItem label="Personal Info" onPress={() => {}}>
          <MaterialIcons name="person" size={24} color="black" />
        </SettingItem>

        <SettingItem
          label="App Appearance"
          onPress={() => router.push("/settings/appearance")}
        >
          <MaterialCommunityIcons
            name="theme-light-dark"
            size={24}
            color={Colors[colorScheme].textPrimary}
          />
        </SettingItem>

        <SettingItem label="Linked Accounts" onPress={() => {}}>
          <MaterialIcons name="link" size={24} color="black" />
        </SettingItem>

        <SettingItem label="Help & Support" onPress={() => {}}>
          <MaterialIcons name="help-outline" size={24} color="black" />
        </SettingItem>

        <SettingItem label="Logout" onPress={logoutHandle}>
          <MaterialIcons name="logout" size={24} color="red" />
        </SettingItem>
      </MenuSection>
    </View>
  );
}
