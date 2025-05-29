import { useTheme } from "@/hooks/useTheme";
import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/Card";

export default function HomeVendedor() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>Produtos Frescos da Fazenda</Text>
          <Text style={styles.subtitle}>
            Sua fonte de frutas e legumes de alta qualidade
          </Text>
        </View>

        {/* Categorias */}
        <View style={styles.categories}>
          <Card style={styles.categoryCard}>
            <Text>Frutas</Text>
          </Card>
          <Card style={styles.categoryCard}>
            <Text>Vegetais</Text>
          </Card>
        </View>

        {/* Produtos em Destaque */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produtos em Destaque</Text>
          <View style={styles.products}>
            <Card style={styles.productCard}>
              <Text style={styles.productTitle}>Maçãs Orgânicas</Text>
              <Text>Maçã</Text>
              <Text style={styles.price}>R$2,99 / kg</Text>
            </Card>
            <Card style={styles.productCard}>
              <Text style={styles.productTitle}>Brócolis Frescos</Text>
              <Text>Brócolis</Text>
              <Text style={styles.price}>R$1,49 / unidade</Text>
            </Card>
          </View>
        </View>

        {/* Avaliações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações dos Clientes</Text>
          <View style={styles.reviews}>
            <Card style={styles.reviewCard}>
              <Text style={styles.reviewName}>Jane Doe ⭐⭐⭐⭐⭐</Text>
              <Text>
                As frutas que pedimos estavam frescas e deliciosas!
              </Text>
            </Card>
            <Card style={styles.reviewCard}>
              <Text style={styles.reviewName}>John Smith ⭐⭐⭐⭐</Text>
              <Text>
                Ótima seleção de produtos, altamente recomendado!
              </Text>
            </Card>
          </View>
        </View>

        {/* Pedidos Recentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pedidos Recentes</Text>
          <Card style={styles.orderCard}>
            <Text>Pedido #123</Text>
            <Text>Entregue em 15/07/2021</Text>
            <Text style={styles.price}>R$30,50</Text>
          </Card>
          <Card style={styles.orderCard}>
            <Text>Pedido #124</Text>
            <Text>Entregue em 16/07/2021</Text>
            <Text style={styles.price}>R$25,75</Text>
          </Card>
        </View>

        {/* Botões */}
        <View style={{ gap: 16, width: "90%" }}>
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

        {/* Desempenho de Vendas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desempenho de Vendas</Text>
          <View style={styles.performance}>
            <Card style={styles.performanceCard}>
              <Text>Receita Total</Text>
              <Text style={styles.performanceValue}>R$5000</Text>
              <Text>+25% em comparação</Text>
            </Card>
            <Card style={styles.performanceCard}>
              <Text>Pedidos</Text>
              <Text style={styles.performanceValue}>150</Text>
              <Text>+10% em comparação</Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40, alignItems: "center", gap: 24 },
  header: { alignItems: "center", marginTop: 16 },
  title: { fontSize: 18, fontWeight: "bold" },
  subtitle: { color: "gray" },

  categories: { flexDirection: "row", gap: 16 },
  categoryCard: {
    width: 100,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },

  section: { width: "90%", gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },

  products: { flexDirection: "row", gap: 16 },
  productCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  productTitle: { fontWeight: "bold" },
  price: { fontWeight: "bold" },

  reviews: { flexDirection: "row", gap: 16 },
  reviewCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
  },
  reviewName: { fontWeight: "bold", marginBottom: 4 },

  orderCard: {
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  button: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 14,
  },
  text: { textAlign: "center", fontWeight: "bold" },

  performance: { flexDirection: "row", gap: 16 },
  performanceCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },
  performanceValue: { fontSize: 20, fontWeight: "bold" },
});
