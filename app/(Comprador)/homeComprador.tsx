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
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";

const categories = ["Frutas", "Vegetais", "Orgânicos"];
const screenWidth = Dimensions.get("window").width; // Obtém a largura da tela

export default function HomeComprador() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { products, isLoading } = useProduct();
  const router = useRouter(); // Substitui o useNavigation

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

          {/* Imagem principal */}
          <View style={styles.banner}>
            <Text style={{ color: colors.text }}>Imagem</Text>
          </View>

          {/* Categorias */}
          <View style={styles.categories}>
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard}>
                <View style={styles.categoryIcon} />
                <Text style={{ color: colors.text }}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Lojas */}
          <TouchableOpacity
            onPress={() => router.push("/listarLojas")} // Navega para a tela /listarLojas
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
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <View style={styles.products}>
              {products.slice(0, 4).map((product) => (
                <TouchableOpacity key={product.id} style={styles.productCard}>
                  <Image
                    source={{
                      uri: product.image || "https://picsum.photos/200",
                    }}
                    style={styles.productImage}
                  />
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>
                    R$ {Number(product.price ?? 0).toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  scroll: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    gap: 40,
  },
  title: {
    width: "100%",
    fontSize: 30,
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
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  categoryCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
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
    fontSize: 24,
    fontWeight: "bold",
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
    borderColor: "#ccc",
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
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
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
});
