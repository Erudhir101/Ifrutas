import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Entypo } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/product";
import { Product } from "@/lib/supabase";

export default function PerfilVendedor() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const {
    id,
    nome,
    endereco,
    distancia,
  }: { id: string; nome: string; endereco: string; distancia: string } =
    useLocalSearchParams();

  async function loadProducts() {
    const product = await fetchProducts(id);
    setProdutos(product);
  }
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logo}>LOGO</Text>
        </View>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Card da Loja */}
        <View style={styles.lojaCard}>
          <View style={styles.lojaInfo}>
            <View style={styles.lojaIcon}>
              <Feather name="user" size={28} color="#555" />
            </View>
            <View style={{ flex: 1 }}>
              {/* TODO: Substituir nome, endereco e distancia pelos dados reais do vendedor vindos do Supabase */}
              <Text style={styles.lojaNome}>{nome}</Text>
              <Text style={styles.lojaEndereco}>{endereco}</Text>
              <View style={styles.distance}>
                <Entypo name="location-pin" size={16} color="#888" />
                <Text style={styles.distanceText}>{distancia}</Text>
              </View>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Conversar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Ligar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Produtos */}
        <Text style={styles.produtoTitulo}>Produtos</Text>
        {/*
          TODO: Substituir o array 'produtos' por dados vindos do Supabase.
          Utilizar useEffect para buscar produtos do vendedor pelo id.
          Exemplo de função futura: fetchProdutosByVendedor(id)
        */}
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          numColumns={4}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.produtoCard}
              // TODO: Navegar para infoProduto.tsx passando o id do produto real
              onPress={() =>
                router.push({
                  pathname: "/infoProduto",
                  params: { item: JSON.stringify(item) },
                })
              }
            >
              <View style={styles.produtoIcon}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.previewImage}
                  />
                ) : (
                  <Feather name="box" size={24} color="#555" />
                )}
              </View>
              <Text style={styles.produtoNome}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  logoBox: {
    backgroundColor: "#EAEAEA",
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  lojaCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lojaInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  lojaIcon: {
    backgroundColor: "#EAEAEA",
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  lojaNome: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  lojaEndereco: {
    fontSize: 13,
    color: "#888",
    marginVertical: 2,
  },
  distance: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    color: "#888",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  actionText: {
    color: "#333",
    fontWeight: "600",
  },
  produtoTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  produtoCard: {
    flex: 1,
    alignItems: "center",
    marginBottom: 16,
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
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    objectFit: "cover",
  },
});
