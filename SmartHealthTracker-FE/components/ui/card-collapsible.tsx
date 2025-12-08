import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { PropsWithChildren } from "react";
import { Text, View } from "react-native";
import { IconSymbol } from "./icon-symbol";

export function CardCollapsible({
  children,
  title,
  subtitle,
  icon = "house.fill",
}: PropsWithChildren & {
  title: string;
  subtitle: string;
  icon?: any;
}) {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <View className="bg-white p-4 rounded-2xl shadow-md ">
      <View className="flex-row items-center gap-4">
        <View className=" bg-secondary rounded-full p-2">
          <IconSymbol
            size={32}
            name={icon}
            color={Colors[colorScheme ?? "light"].primary}
          />
        </View>
        <View>
          <Text className="text-lg font-semibold">{title}</Text>
          <Text>{subtitle}</Text>
        </View>
        {/* <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          className="ml-auto p-2"
        >
          <IconSymbol
            size={24}
            name={isOpen ? "chevron.up" : "chevron.down"}
            color={Colors[colorScheme ?? "light"].tint}
          />
        </TouchableOpacity> */}
      </View>

      <View className="mt-4 gap-4">{children}</View>
    </View>
  );
}
