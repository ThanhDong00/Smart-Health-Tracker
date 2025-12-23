import { CardCollapsible } from "@/components/ui/card-collapsible";
import ProgressBar from "@/components/ui/progress-bar-h";
import SedentaryReminder from "@/components/ui/sedentary-reminder";
import SleepBarChart from "@/components/ui/sleep-bar-chart";
import { useTheme } from "@/hooks/useTheme";
import { useStepCounter } from "@/hooks/useStepCounter";
import { Stack } from "expo-router";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { registerBackgroundSync } from "@/services/backgroundSync.service";

export default function HomeScreen() {
  const { isDark } = useTheme();
  const { currentSteps, isAvailable, isLoading } = useStepCounter();
  const stepGoal = 10000;

  // Register background sync on mount
  useEffect(() => {
    registerBackgroundSync();
  }, []);

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      } p-8`}
      edges={["top"]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Home",
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
        <View className="mb-6">
          <Text
            className={`text-3xl font-bold ${
              isDark ? "text-text-primary" : "text-text-dark"
            }`}
          >
            Welcome back!
          </Text>
          <Text
            className={`text-lg mt-1 ${
              isDark ? "text-text-secondary" : "text-text-muted"
            }`}
          >
            Here's a summary of your health stats for today.
          </Text>
        </View>

        <View className="gap-4">
          {/* Sedentary Clock */}
          <SedentaryReminder isDark={isDark} />

          {/* Walk */}
          <CardCollapsible
            title="Daily Walking"
            subtitle="Total steps in a day"
            icon="directions-walk"
            isDark={isDark}
          >
            <View>
              {isLoading ? (
                <View className="py-4 items-center">
                  <ActivityIndicator
                    size="large"
                    color={isDark ? "#3b82f6" : "#2563eb"}
                  />
                  <Text
                    className={`mt-2 text-sm ${
                      isDark ? "text-text-secondary" : "text-text-muted"
                    }`}
                  >
                    Loading step data...
                  </Text>
                </View>
              ) : !isAvailable ? (
                <View className="py-4 items-center">
                  <Text
                    className={`text-sm ${
                      isDark ? "text-text-secondary" : "text-text-muted"
                    }`}
                  >
                    Pedometer not available on this device
                  </Text>
                </View>
              ) : (
                <>
                  <ProgressBar
                    current={currentSteps}
                    max={stepGoal}
                    color="bg-primary"
                    backgroundColor="bg-secondary"
                  />

                  <View className="mt-2 flex-row justify-between">
                    <View>
                      <Text
                        className={`text-sm ${
                          isDark ? "text-text-secondary" : "text-text-muted"
                        }`}
                      >
                        {currentSteps.toLocaleString()} steps
                      </Text>
                    </View>
                    <View>
                      <Text
                        className={`text-sm ${
                          isDark ? "text-text-secondary" : "text-text-muted"
                        }`}
                      >
                        {stepGoal.toLocaleString()} steps goal
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </CardCollapsible>

          <CardCollapsible
            title="Heart Rate"
            subtitle="72 bpm"
            icon="favorite"
            isDark={isDark}
          />

          {/* Sleep */}
          <CardCollapsible
            title="Sleep Tracking"
            subtitle="Sleep duration in hours"
            icon="bedtime"
            isDark={isDark}
          >
            <SleepBarChart />
          </CardCollapsible>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
