import Avaliacoes from "@/components/Avaliacoes";
import { useAuth } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { fetchProducts } from "@/lib/product";
import { Product } from "@/lib/supabase";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeVendedor() {
  const { colors } = useTheme();
  const { user } = useAuth();
  function ListProductDestaque() {
    const [products, setProducts] = useState<Product[]>([]);
    const loadProducts = async () => {
      const fetched = await fetchProducts(user?.id ?? "");
      setProducts(fetched);
    };

    useEffect(() => {
      loadProducts();
    }, []);
    return (
      <View style={{ width: "100%", paddingHorizontal: 15, gap: 15 }}>
        <Text style={[styles.text, styles.title, { alignSelf: "flex-start" }]}>
          Produtos em Destaque
        </Text>
        {products.length === 0 ? (
          <Text>Carregando produtos...</Text>
        ) : (
          <View style={{ flexDirection: "row", gap: 15 }}>
            {products.slice(0, 2).map((p) => {
              return (
                <View key={p.id} style={styles.cardContainer}>
                  {p.image && (
                    <Image source={{ uri: p.image }} style={styles.cardImage} />
                  )}
                  <Text style={styles.cardTitle}>{p.name}</Text>
                  <Text style={styles.cardPrice}>R$ {p.price?.toFixed(2)}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          gap: 15,
        }}
      >
        <Image source={{ uri: user?.avatar_url }} style={styles.image} />
        <View style={{ alignItems: "flex-start" }}>
          <Text style={[styles.title, styles.text]}>{user?.full_name}</Text>
          <Text style={[styles.text, styles.subtitle]}>entregador</Text>
        </View>
      </View>

      <Link href="/criarProduto" asChild>
        <TouchableOpacity style={{ width: "100%" }}>
          <ListProductDestaque />
        </TouchableOpacity>
      </Link>
      <Avaliacoes user={user} />
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
  title: { fontSize: 25 },
  subtitle: {
    fontSize: 16,
    color: "#999",
    fontWeight: "light",
    fontStyle: "italic",
  },
  button: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 14,
  },
  image: {
    width: 60,
    height: 60,
    borderWidth: 1,
    aspectRatio: 1,
    borderRadius: 100,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 4,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardPrice: {
    fontSize: 18,
    color: "green",
    marginTop: 5,
  },
});
