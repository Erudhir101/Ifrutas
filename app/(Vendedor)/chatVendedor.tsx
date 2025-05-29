import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function ChatVendedor() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text>chat</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
