import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CarrinhoComprador() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>carrinho</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
