import { Stack, Tabs } from "expo-router";
import "react-native-reanimated";
import { View, StyleSheet } from "react-native";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomTabs from "@/components/BottomTabs";

export default function LayoutComprador() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return <BottomTabs />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
