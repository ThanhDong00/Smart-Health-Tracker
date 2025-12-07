import MenuSection from "@/components/ui/account/menu-section";
import SettingItem from "@/components/ui/account/setting-item";
import { View } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-neutral-100 p-8 felx-col gap-4">
      <MenuSection>
        <SettingItem
          icon="gearshape.fill"
          label="App Settings"
          onPress={() => {}}
        ></SettingItem>

        <SettingItem
          icon="gearshape.fill"
          label="App Settings"
          onPress={() => {}}
        ></SettingItem>
      </MenuSection>

      <MenuSection>
        <SettingItem
          icon="gearshape.fill"
          label="App Settings"
          onPress={() => {}}
        ></SettingItem>

        <SettingItem
          icon="gearshape.fill"
          label="App Settings"
          onPress={() => {}}
        ></SettingItem>
      </MenuSection>
    </View>
  );
}
