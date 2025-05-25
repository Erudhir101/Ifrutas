import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatComprador() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text>chat</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
