import DarkMode from "@/components/DarkMode";
import SignOut from "@/components/SignOut";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function ContaVendedor() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text>conta</Text>
      <DarkMode />
      <SignOut />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
