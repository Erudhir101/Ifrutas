import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const produtosExemplo = [
  {
    id: "1",
    nome: "Melancia Quadrada",
    preco: 46.12,
    quantidade: 1,
  },
  {
    id: "2",
    nome: "Mertilo Dourado",
    preco: 26.52,
    quantidade: 3,
  },
];

export default function Carrinho() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [carrinho, setCarrinho] = useState(produtosExemplo);
  const [search, setSearch] = useState("");

  // Filtra os produtos do carrinho conforme o texto digitado
  const carrinhoFiltrado = carrinho.filter((item) =>
    item.nome.toLowerCase().includes(search.toLowerCase())
  );

  const total = carrinhoFiltrado.reduce(
    (sum, item) => sum + item.preco * item.quantidade,
    0
  );

  const removerItem = (id: string) => {
    const atualizado = carrinho.filter((item) => item.id !== id);
    setCarrinho(atualizado);
  };

  const renderItem = ({ item }: { item: typeof produtosExemplo[0] }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.card }]}>
      <View style={styles.itemInfo}>
        <View style={styles.itemIcon}>
          <FontAwesome name="cube" size={24} color={colors.secondary} />
        </View>
        <View>
          <Text style={[styles.itemName, { color: colors.text }]}>
            {item.nome}
          </Text>
          <Text style={{ color: colors.secondary }}>
            Quantidade: {item.quantidade}
          </Text>
          <Text style={{ color: colors.text }}>
            R$ {item.preco.toFixed(2)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removerItem(item.id)}
      >
        <Text style={styles.removeButtonText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>LOGO</Text>
        </View>
        <Feather name="bell" size={24} color={colors.text} />
      </View>

      {/* Barra de Pesquisa */}
      <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
        <Feather name="search" size={20} color={colors.secondary} />
        <TextInput
          style={{ color: colors.secondary, marginLeft: 8, flex: 1 }}
          placeholder="Buscar produto..."
          placeholderTextColor={colors.secondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Lista de Itens */}
      <FlatList
        data={carrinhoFiltrado}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text
            style={{
              color: colors.text,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Seu carrinho está vazio.
          </Text>
        }
      />

      {/* Total e Endereço */}
      <View style={styles.footer}>
        <Text style={[styles.totalText, { color: colors.text }]}>
          Total: R$ {total.toFixed(2)}
        </Text>

        <TouchableOpacity
          style={[styles.addressContainer, { backgroundColor: colors.card }]}
        >
          <Feather name="map-pin" size={20} color={colors.primary} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={[styles.addressText, { color: colors.text }]}>
              Enviar para CSB 10 Conj...
            </Text>
          </View>
          <Text style={{ color: colors.primary, fontWeight: "bold" }}>
            Alterar
          </Text>
        </TouchableOpacity>

        {/* Botão Comprar */}
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logoContainer: {
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 16,
    fontWeight: "bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    backgroundColor: "#E0E0E0",
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "center",
  },
  removeButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  buyButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  menuText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    color: "#333",
  },
});
