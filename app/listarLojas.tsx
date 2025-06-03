import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useStore } from "@/hooks/LojaContext";

export default function ListarLojas() {
  const { stores, isLoading } = useStore();
  const [search, setSearch] = useState("");

  // Filtra as lojas com base no texto de busca
  const filteredStores = stores.filter((store) =>
    store.name?.toLowerCase().includes(search.toLowerCase())
  );

  const renderStoreItem = ({ item }: { item: Store }) => (
    <View style={styles.storeCard}>
      <View style={styles.storeInfo}>
        <Image
          source={{
            uri: item.avatar_url || "https://via.placeholder.com/50", // Fallback para imagem padrão
          }}
          style={styles.storeImage}
        />
        <View>
          <Text style={styles.storeName}>{item.name || "Nome não disponível"}</Text>
          <Text style={styles.storeAddress}>{item.endereco || "Endereço não disponível"}</Text>
          <Text style={styles.storeDistance}>7Km de Distância</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.openButton}>
        <Text style={styles.openButtonText}>Abrir</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Carregando lojas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Lojas na região</Text>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>LOGO</Text>
        </View>
      </View>

      {/* Campo de busca */}
      <TextInput
        style={styles.searchInput}
        placeholder="Hortifruti"
        value={search}
        onChangeText={setSearch}
      />

      {/* Lista de lojas */}
      <FlatList
        data={filteredStores}
        keyExtractor={(item) => item.id}
        renderItem={renderStoreItem}
        contentContainerStyle={styles.storeList}
        ListEmptyComponent={
          !isLoading && (
            <Text style={styles.emptyText}>Nenhuma loja encontrada.</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  logoContainer: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  searchInput: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  storeList: {
    paddingBottom: 20,
  },
  storeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  storeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  storeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: "#E0E0E0",
  },
  storeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  storeAddress: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  storeDistance: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  openButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  openButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
});