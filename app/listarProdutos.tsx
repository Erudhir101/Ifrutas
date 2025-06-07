import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Category, Product } from "@/lib/supabase";
import { useProduct } from "@/hooks/ProductContext";

export default function ListarProdutos() {
  const router = useRouter();
  const { products, fetchProductsByCategory } = useProduct();

  const { item }: { item: string } = useLocalSearchParams();
  const categoria: Category = item as Category;

  useEffect(() => {
    fetchProductsByCategory(categoria);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.produtoTitulo}>Produtos</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.produtoCard}
            onPress={() =>
              router.push({
                pathname: "/infoProduto",
                params: { item: JSON.stringify(item) },
              })
            }
          >
            <View style={styles.produtoIcon}>
              {item?.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={[
                    styles.produtoIcon,
                    { aspectRatio: 1, width: "100%", objectFit: "cover" },
                  ]}
                />
              ) : (
                <Feather
                  style={styles.produtoIcon}
                  name="box"
                  size={24}
                  color="#555"
                />
              )}
            </View>
            <Text style={styles.produtoNome}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  produtoTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 32,
    marginTop: 40,
  },
  produtoCard: {
    flex: 1,
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: 4,
  },
  produtoIcon: {
    backgroundColor: "#EAEAEA",
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  produtoNome: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    fontWeight: "bold",
  },
});
