import { useRouter } from "expo-router"; // adicione esta linha
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import SearchInput from "@/components/SearchInput";
import { useAuth } from "@/hooks/AuthContext"; // Importe o hook de autenticação

const initialItems = [
  { id: "1", value: 23, name: "Apple", category: "Fruit" },
  { id: "2", value: 20, name: "Banana", category: "Fruit" },
  { id: "3", value: 13, name: "Carrot", category: "Vegetable" },
  { id: "4", value: 33, name: "Dog", category: "Animal" },
  { id: "5", value: 43, name: "Elephant", category: "Animal" },
  { id: "6", value: 63, name: "Grape", category: "Fruit" },
  { id: "7", value: 93, name: "Tomato", category: "Fruit/Vegetable" },
  { id: "8", value: 33, name: "Zebra", category: "Animal" },
];

export default function CarrinhoComprador() {
  const router = useRouter(); // adicione esta linha
  const { colors } = useTheme();
  const { user } = useAuth(); // Obtenha as informações do usuário
  const [filteredItems, setFilteredItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState("");

  // useEffect to perform filtering whenever searchQuery changes
  useEffect(() => {
    if (searchQuery === "") {
      // If search query is empty, show all items
      setFilteredItems(initialItems);
    } else {
      // Filter items based on the search query (case-insensitive)
      const lowerCaseQuery = searchQuery.toLowerCase();
      const newFilteredItems = initialItems.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerCaseQuery) ||
          item.category.toLowerCase().includes(lowerCaseQuery),
      );
      setFilteredItems(newFilteredItems);
    }
  }, [searchQuery]); // Depend on searchQuery and initialItems

  // Render function for each item in the FlatList
  const renderItem = ({ item }) => (
    <View
      style={[
        styles.listItem,
        { backgroundColor: colors.nav, shadowColor: colors.text },
      ]}
    >
      <View style={[{ gap: 8 }]}>
        <Text style={[styles.itemName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemCategory, { color: colors.secondary }]}>
          {item.category}
        </Text>
        <Text style={[styles.itemValue, { color: colors.text }]}>
          R$ {item.value}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          alignSelf: "flex-end",
          backgroundColor: colors.secondary,
          borderRadius: 16,
        }}
      >
        <Text
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            color: colors.nav,
          }}
        >
          Remover
        </Text>
      </TouchableOpacity>
    </View>
  );

  const total = initialItems.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>
          IFruts - carrinho
        </Text>
        <SearchInput search={searchQuery} setSearch={setSearchQuery} />
        <View
          style={[
            styles.info,
            { backgroundColor: colors.background, shadowColor: colors.text },
          ]}
        >
          <Text
            style={{ color: colors.text, fontSize: 20, fontWeight: "bold" }}
          >
            Total R$ {total}
          </Text>
          <Text style={{ color: colors.textSecondary }}>Endereço</Text>
          <TouchableOpacity
            onPress={() => {
              const userId = user?.id || "GUEST"; // Use o ID do usuário ou "GUEST" como fallback
              const orderId = `${userId}-${Date.now()}`; // Combina o ID do usuário com o timestamp
              router.push({
                pathname: "_acompanharPedido", // Nome da rota
                params: { id: orderId }, // Passa o ID como parâmetro
              });
            }}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingVertical: 18,
              paddingHorizontal: 8,
              width: "85%",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: colors.nav,
                fontWeight: "600",
              }}
            >
              Comprar
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={[styles.emptyListText, { color: colors.card }]}>
              No items found.
            </Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: {
    fontSize: 20,
    fontWeight: "600",
  },
  itemCategory: {
    fontSize: 14,
    marginTop: 4,
  },
  itemValue: {
    fontSize: 16,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  info: {
    alignItems: "center",
    gap: 16,
  },
});
