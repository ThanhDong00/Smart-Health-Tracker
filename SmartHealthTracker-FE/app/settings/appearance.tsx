import MenuSection from "@/components/ui/account/menu-section";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { useMemo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppearanceScreen() {
  const { isDark, theme, setTheme } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "30%"], []);

  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log("handleSheetChanges", index);
  // }, []);

  const handleThemeSelect = (selectedTheme: "light" | "dark") => {
    setTheme(selectedTheme);
    bottomSheetRef.current?.close();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        className={`flex-1 ${
          isDark ? "bg-background-dark" : "bg-background-light"
        }`}
        edges={["top"]}
      >
        <Stack.Screen
          options={{
            title: "App Appearance",
            headerShown: true,
            headerTitleAlign: "center",
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
        <View className="flex-1 p-8">
          <MenuSection isDark={isDark}>
            <TouchableOpacity
              className={`flex-row items-center justify-between px-4 py-3 min-h-[56px] border-b ${
                isDark
                  ? "bg-surface-dark border-surface-variant-dark"
                  : "bg-card-light border-surface-light"
              }`}
              onPress={() => bottomSheetRef.current?.expand()}
            >
              <Text
                className={`text-base ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                Theme
              </Text>
              <View className="flex-row items-center gap-2">
                <Text
                  className={`capitalize ${
                    isDark ? "text-text-secondary" : "text-text-muted"
                  }`}
                >
                  {theme}
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={isDark ? "#a6adc8" : "#64748b"}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row items-center justify-between px-4 py-3 min-h-[56px] border-b ${
                isDark
                  ? "bg-surface-dark border-surface-variant-dark"
                  : "bg-card-light border-surface-light"
              }`}
            >
              <Text
                className={`text-base ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                Language
              </Text>
              <View className="flex-row items-center gap-2">
                <Text
                  className={isDark ? "text-text-secondary" : "text-text-muted"}
                >
                  English
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={isDark ? "#a6adc8" : "#64748b"}
                />
              </View>
            </TouchableOpacity>
          </MenuSection>
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          // onChange={handleSheetChanges}
          enablePanDownToClose={true}
          backgroundStyle={{
            backgroundColor: isDark ? "#1e1e2e" : "#ffffff",
          }}
          handleIndicatorStyle={{
            backgroundColor: isDark ? "#a6adc8" : "#64748b",
          }}
        >
          <BottomSheetView
            className={`p-6 ${isDark ? "bg-surface-dark" : "bg-white"}`}
          >
            <Text
              className={`text-xl font-bold mb-4 ${
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              Select Theme
            </Text>

            <TouchableOpacity
              className={`py-4 border-b ${
                isDark ? "border-surface-variant-dark" : "border-gray-200"
              }`}
              onPress={() => handleThemeSelect("light")}
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className={`text-base ${
                    isDark ? "text-text-primary" : "text-text-dark"
                  }`}
                >
                  Light
                </Text>
                {theme === "light" && (
                  <MaterialIcons
                    name="check"
                    size={24}
                    color={isDark ? "#00b894" : "#7f27ff"}
                  />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-4"
              onPress={() => handleThemeSelect("dark")}
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className={`text-base ${
                    isDark ? "text-text-primary" : "text-text-dark"
                  }`}
                >
                  Dark
                </Text>
                {theme === "dark" && (
                  <MaterialIcons
                    name="check"
                    size={24}
                    color={isDark ? "#00b894" : "#7f27ff"}
                  />
                )}
              </View>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
