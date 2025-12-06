import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { PropsWithChildren } from "react";
import { Text, View } from "react-native";
import { IconSymbol } from "./icon-symbol";

export function CardCollapsible({
  children,
  title,
  subtitle,
}: PropsWithChildren & {
  title: string;
  subtitle: string;
}) {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <View className="bg-blue-100 p-4 rounded-2xl shadow-md ">
      <View className="flex-row items-center gap-4">
        <IconSymbol
          size={32}
          name="house.fill"
          color={Colors[colorScheme ?? "light"].tint}
        />
        <View>
          <Text className="text-lg">{title}</Text>
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
