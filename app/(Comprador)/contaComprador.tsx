import DarkMode from "@/components/DarkMode";
import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignOut from "@/components/SignOut";

export default function ContaComprador() {
  const { colors, theme } = useTheme();
  const cor = useColorScheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <DarkMode />
      <SignOut />
      <Text style={{ color: "orange" }}>
        {theme} - {cor}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  darkmode: { borderRadius: "100%" },
});
