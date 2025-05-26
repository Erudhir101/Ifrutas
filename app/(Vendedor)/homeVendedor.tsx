import { useTheme } from "@/hooks/useTheme";
import { Link } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeVendedor() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={styles.container}>
      <Text>Vendedor</Text>
      <View style={{ gap: 16, width: "80%" }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.nav }]}
        >
          <Text style={styles.text}>Gerenciar Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.nav }]}
        >
          <Text style={styles.text}>Ver Análises</Text>
        </TouchableOpacity>

        <Link
          href="/criarProduto"
          asChild
          style={[styles.button, { backgroundColor: colors.text }]}
        >
          <TouchableOpacity>
            <Text style={[styles.text, { color: colors.nav }]}>
              Adicionar Novo Produto
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  text: { textAlign: "center", fontWeight: "bold" },
  button: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 14,
  },
});
