import { CardCollapsible } from "@/components/ui/card-collapsible";
import ProgressBar from "@/components/ui/progress-bar-h";
import SleepBarChart from "@/components/ui/sleep-bar-chart";
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { isDark } = useTheme();

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
            backgroundColor: isDark ? "#1a1a1a" : "#f8fafc",
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
          {/* Walk */}
          <CardCollapsible
            title="Daily Walking"
            subtitle="Total steps in a day"
            icon="directions-walk"
            isDark={isDark}
          >
            <View>
              <ProgressBar
                current={6754}
                max={10000}
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
                    6754 steps
                  </Text>
                </View>
                <View>
                  <Text
                    className={`text-sm ${
                      isDark ? "text-text-secondary" : "text-text-muted"
                    }`}
                  >
                    10,000 steps goal
                  </Text>
                </View>
              </View>
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
