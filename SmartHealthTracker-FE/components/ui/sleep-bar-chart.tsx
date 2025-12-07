import { useFont } from "@shopify/react-native-skia";
import { View } from "react-native";
import { Bar, CartesianChart } from "victory-native";

export default function SleepBarChart() {
  const data = [
    { day: "Mon", hours: 6.5 },
    { day: "Tue", hours: 7 },
    { day: "Wen", hours: 7.45 },
    { day: "Thi", hours: 8 },
    { day: "Fri", hours: 6.45 },
    { day: "Sat", hours: 6 },
    { day: "Sun", hours: 0 },
  ];

  const hoursValues = data.map((d) => d.hours);
  const minHours = Math.min(...hoursValues);
  const maxHours = Math.max(...hoursValues);
  const mindomain = minHours - 2 >= 0 ? minHours - 2 : 0;

  return (
    <View style={{ height: 200 }}>
      <CartesianChart
        data={data}
        xKey="day"
        yKeys={["hours"]}
        domain={{ y: [mindomain, maxHours + 1] }}
        domainPadding={{ left: 20, right: 20 }}
        axisOptions={{
          font: useFont(
            require("@/assets/fonts/JetBrainsMono-Regular.ttf"),
            12
          ),
        }}
      >
        {({ points, chartBounds }) => (
          <Bar
            chartBounds={chartBounds}
            points={points.hours}
            roundedCorners={{ topLeft: 4, topRight: 4 }}
          />
        )}
      </CartesianChart>
    </View>
  );
}
