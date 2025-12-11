import MenuSection from "@/components/ui/account/menu-section";
import { IconSymbol } from "@/components/ui/icon-symbol";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function AppearanceScreen() {
  const [selectedTheme, setSelectedTheme] = useState<
    "light" | "dark" | "system"
  >("light");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "40%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleThemeSelect = (theme: "light" | "dark" | "system") => {
    setSelectedTheme(theme);
    bottomSheetRef.current?.close();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "App Appearance",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <View className="flex-1 bg-background p-8 felx-col gap-4">
        <MenuSection>
          <TouchableOpacity
            className="flex-row items-center justify-between bg-cardBackground px-4 py-3 min-h-[56px] border-b border-neutral-200"
            onPress={() => bottomSheetRef.current?.expand()}
          >
            <Text>Theme</Text>
            <View className="flex-row items-center gap-2">
              <Text className="capitalize">{selectedTheme}</Text>
              <IconSymbol name="chevron.right" size={24} color="#000" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between bg-cardBackground px-4 py-3 min-h-[56px] border-b border-neutral-200">
            <Text>Language</Text>
            <View className="flex-row items-center gap-2">
              <Text>English</Text>
              <IconSymbol name="chevron.right" size={24} color="#000" />
            </View>
          </TouchableOpacity>
        </MenuSection>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
      >
        <BottomSheetView className="p-6">
          <Text className="text-xl font-bold mb-4">Select Theme</Text>

          <TouchableOpacity
            className="py-4 border-b border-gray-200"
            onPress={() => handleThemeSelect("light")}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-base">Light</Text>
              {selectedTheme === "light" && (
                <IconSymbol name="checkmark" size={24} color="#000" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4 border-b border-gray-200"
            onPress={() => handleThemeSelect("dark")}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-base">Dark</Text>
              {selectedTheme === "dark" && (
                <IconSymbol name="checkmark" size={24} color="#000" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4"
            onPress={() => handleThemeSelect("system")}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-base">System</Text>
              {selectedTheme === "system" && (
                <IconSymbol name="checkmark" size={24} color="#000" />
              )}
            </View>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
