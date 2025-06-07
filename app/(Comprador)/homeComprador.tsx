import { useAuth } from "@/hooks/AuthContext";

import { useTheme } from "@/hooks/useTheme";
import { useProduct } from "@/hooks/ProductContext";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import Carousel from "@/components/Carousel";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Category, Review } from "@/lib/supabase";
import { fetchAllReviews, fetchReviews } from "@/lib/review";

const categories: Category[] = ["Frutas", "Verduras", "Organicos"];
const screenWidth = Dimensions.get("window").width; // Obtém a largura da tela
const stores = [
  { title: "Mais Vendidos", desc: "Frutas Frescas", badge: "Entrega Grátis" },
  {
    title: "Orgânicas",
    desc: "Vegetais saudáveis",
    badge: "10% Desconto Hoje",
  },
];
const updates = [
  {
    title: "Produtos Frescos",
    desc: "Produtos frescos de alta qualidade",
    tags: ["Novo", "Oferta"],
    author: "FreshGreens",
    start: 5,
  },
  {
    title: "Vegetais",
    desc: "Melhores fazendas!",
    tags: ["Local"],
    author: "Farm2Table",
    start: 0,
  },
];

export default function HomeComprador() {
  let names: string[];
  const { user } = useAuth();
  const { colors } = useTheme();
  const { products, fetchProducts } = useProduct();
  const [reviews, setReviews] = useState<
    (Review & { author: { full_name: string } | null })[]
  >([]);

  const recommended = [...products].sort(() => 0.5 - Math.random()).slice(0, 2);

  const photos = products
    .map((product) => {
      return product.image ?? "";
    })
    .slice(0, 5);

  const pages = products
    .map((product) => {
      return product.image ?? "";
    })
    .slice(5, 7);
  const router = useRouter(); // Substitui o useNavigation

  const loadReviews = async () => {
    const fetched = await fetchAllReviews();
    setReviews(fetched);
  };

  useEffect(() => {
    fetchProducts();
    loadReviews();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scroll}>
          {/* Boas-vindas */}
          <Text style={[styles.title, { color: colors.text }]}>
            Bem vindo(a){" "}
            {<Text style={{ color: colors.primary }}>{user?.full_name}</Text>}
          </Text>

          {/* Carousel */}
          <Carousel pages={photos} />

          {/* Categorias */}
          <View style={styles.categories}>
            {categories.map((item, key) => (
              <TouchableOpacity
                key={key}
                style={[styles.categorie, { borderColor: colors.border }]}
                onPress={() =>
                  router.push({
                    pathname: "/listarProdutos",
                    params: { item: item },
                  })
                }
              >
                <View style={styles.categorieImage} />
                <Text style={{ color: colors.text }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Lojas */}
          <TouchableOpacity
            onPress={() => router.push("/(Comprador)/_screens/listarLojas")}
          >
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              Lojas
            </Text>
          </TouchableOpacity>
          <View style={styles.stores}>
            <TouchableOpacity style={styles.storeCard}>
              <Text style={styles.storeTitle}>Mais Vendidos</Text>
              <Text style={styles.storeSubtitle}>Frutas Frescas</Text>
              <Text style={styles.storeFooter}>Entrega Grátis</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.storeCard}>
              <Text style={styles.storeTitle}>Orgânicas</Text>
              <Text style={styles.storeSubtitle}>Vegetais saudáveis</Text>
              <Text style={styles.storeFooter}>10% Desconto Hoje</Text>
            </TouchableOpacity>
          </View>

          {/* Mapa */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Encontre uma vendedor perto de você!
          </Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -15.7942, // Latitude inicial (exemplo: Brasília)
              longitude: -47.8822, // Longitude inicial
              latitudeDelta: 0.05, // Zoom do mapa
              longitudeDelta: 0.05,
            }}
          >
            {/* Exemplo de marcador */}
            <Marker
              coordinate={{
                latitude: -15.7942,
                longitude: -47.8822,
              }}
              title="Vendedor 1"
              description="Frutas frescas disponíveis"
            />
          </MapView>

          {/* Produtos Recomendados */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Produtos Recomendados
          </Text>
          <View style={styles.row}>
            {recommended.map((item, key) => (
              <TouchableOpacity
                key={key}
                style={[styles.card, { borderColor: colors.nav }]}
                onPress={() =>
                  router.push({
                    pathname: "/infoProduto",
                    params: { item: JSON.stringify(item) },
                  })
                }
                activeOpacity={0.8}
              >
                <Image
                  source={{
                    uri: item.image || "https://picsum.photos/200",
                  }}
                  style={styles.productImage}
                />
                <Text style={styles.cardTag}>
                  {["Produto novo", "Escolhas saudáveis"][key]}
                </Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterText}>
                    {item.name + [" Gostosa", " Apetitosa"][key]}
                  </Text>
                  <Text style={styles.cardBadge}>
                    {["Direto da fonte", "Paque 3 leve 2"][key]}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Botão */}
          <TouchableOpacity
            style={[
              styles.mainButton,
              { backgroundColor: colors.text, borderColor: colors.nav },
            ]}
            onPress={() => router.push("/(Comprador)/_screens/listarLojas")}
          >
            <Text style={{ color: colors.background, fontWeight: "bold" }}>
              Todas as Lojas
            </Text>
          </TouchableOpacity>

          {/* Reviews */}
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, borderColor: colors.border },
            ]}
          >
            Review dos Usuários
          </Text>
          <View style={styles.row}>
            {reviews.map((item, key) => (
              <View
                key={key}
                style={[styles.reviewCard, { borderColor: colors.nav }]}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: colors.text,
                    alignItems: "center",
                  }}
                >
                  {item.author?.full_name +
                    "  " +
                    "⭐⭐⭐⭐⭐".slice(0, item.stars)}
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: "bold",
                    fontStyle: "italic",
                  }}
                >
                  {item.review}
                </Text>
              </View>
            ))}
          </View>

          {/* Últimas Atualizações */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Últimas Atualizações
          </Text>
          <View style={styles.row}>
            {updates.map((item, key) => (
              <TouchableOpacity
                key={key}
                style={[styles.card, { borderColor: colors.nav }]}
                activeOpacity={0.8}
                onPress={() => router.push("/perfilVendedor")}
              >
                {/* Carousel menor dentro do card */}
                <View style={{ height: 100, marginBottom: 8 }}>
                  <Carousel pages={pages} />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
                <View style={styles.cardFooter}>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {item.tags.map((tag, i) => (
                      <Text key={i} style={styles.tag}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                  <Text style={styles.cardFooterText}>{item.author}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30, // mantém o maior valor
    paddingHorizontal: 15,
  },
  scroll: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    gap: 40, // mantém o maior valor
  },
  title: {
    width: "100%",
    fontSize: 30, // mantém o maior valor
    fontWeight: "bold",
    textAlign: "left",
  },
  banner: {
    width: "100%",
    height: 200,
    backgroundColor: "#ccc",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  categories: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  categorie: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  categorieImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
  },
  categoryCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 5,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    backgroundColor: "#eee",
    borderRadius: 25,
    marginBottom: 10,
  },
  sectionTitle: {
    width: "100%",
    fontSize: 24, // mantém o maior valor
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 20,
  },
  stores: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  storeCard: {
    flex: 1,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 5,
  },
  storeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  storeSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  storeFooter: {
    fontSize: 12,
    color: "#888",
  },
  map: {
    width: "100%",
    height: 200, // mantém o maior valor
    backgroundColor: "#eee",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  mapText: {
    fontWeight: "bold",
  },
  products: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: (screenWidth - 60) / 2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
  },
  // Novos estilos mesclados
  row: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  card: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
    padding: 12,
    gap: 6,
  },
  cardTitle: {
    fontWeight: "bold",
  },
  cardDesc: {
    color: "#555",
  },
  cardTag: {
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 4,
    alignItems: "stretch",
  },
  cardFooterText: {
    color: "#555",
  },
  cardBadge: {
    fontWeight: "bold",
  },
  mainButton: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  reviewCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
    padding: 15,
    gap: 10,
  },
  tag: {
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
  },
});
