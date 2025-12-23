import MenuSection from "@/components/ui/account/menu-section";
import { useTheme } from "@/hooks/useTheme";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const INTERVAL_OPTIONS = [1, 15, 30, 45, 60, 90, 120];
const STORAGE_KEY = "sedentary_reminder_interval";

export default function SedentarySetting() {
  const { isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState(60);

  useEffect(() => {
    loadInterval();
  }, []);

  const loadInterval = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) {
        setSelectedInterval(parseInt(value));
      }
    } catch (error) {
      console.error("Error loading interval:", error);
    }
  };

  const saveInterval = async (interval: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, interval.toString());
      setSelectedInterval(interval);
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving interval:", error);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      } p-8`}
      edges={["top"]}
    >
      <Stack.Screen
        options={{
          title: "Sedentary Detection Setting",
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
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View>
          <MenuSection isDark={isDark}>
            <TouchableOpacity
              className={`flex-row items-center justify-between px-4 py-3 min-h-[56px] border-b ${
                isDark
                  ? "bg-surface-dark border-surface-variant-dark"
                  : "bg-card-light border-surface-light"
              }`}
              onPress={() => setModalVisible(true)}
            >
              <Text
                className={`text-base ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                Reminder Interval
              </Text>
              <View className="flex-row items-center gap-2">
                <Text
                  className={`capitalize ${
                    isDark ? "text-text-secondary" : "text-text-muted"
                  }`}
                >
                  {selectedInterval} minutes
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color={isDark ? "#a6adc8" : "#64748b"}
                />
              </View>
            </TouchableOpacity>
          </MenuSection>
        </View>
      </ScrollView>

      {/* Modal for selecting interval */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/50"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            className={`w-4/5 rounded-2xl p-6 ${
              isDark ? "bg-surface-dark" : "bg-white"
            }`}
            onPress={(e) => e.stopPropagation()}
          >
            <Text
              className={`text-xl font-bold mb-4 text-center ${
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              Select Reminder Interval
            </Text>

            <View className="gap-2">
              {INTERVAL_OPTIONS.map((interval) => (
                <TouchableOpacity
                  key={interval}
                  className={`p-4 rounded-xl flex-row items-center justify-between ${
                    selectedInterval === interval
                      ? isDark
                        ? "bg-primary/20"
                        : "bg-primary/10"
                      : isDark
                        ? "bg-surface-variant-dark"
                        : "bg-gray-100"
                  }`}
                  onPress={() => saveInterval(interval)}
                >
                  <Text
                    className={`text-lg ${
                      selectedInterval === interval
                        ? "text-primary font-semibold"
                        : isDark
                          ? "text-text-primary"
                          : "text-text-dark"
                    }`}
                  >
                    {interval} minutes
                  </Text>
                  {selectedInterval === interval && (
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color="#3b82f6"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className={`mt-6 p-4 rounded-xl ${
                isDark ? "bg-surface-variant-dark" : "bg-gray-200"
              }`}
              onPress={() => setModalVisible(false)}
            >
              <Text
                className={`text-center font-semibold ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
