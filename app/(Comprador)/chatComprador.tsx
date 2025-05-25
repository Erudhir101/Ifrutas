import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatComprador() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>chat</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
