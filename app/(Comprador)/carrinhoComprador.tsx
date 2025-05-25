import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import SearchInput from "@/components/SearchInput";

const initialItems = [
  { id: "1", name: "Apple", category: "Fruit" },
  { id: "2", name: "Banana", category: "Fruit" },
  { id: "3", name: "Carrot", category: "Vegetable" },
  { id: "4", name: "Dog", category: "Animal" },
  { id: "5", name: "Elephant", category: "Animal" },
  { id: "6", name: "Grape", category: "Fruit" },
  { id: "7", name: "Tomato", category: "Fruit/Vegetable" },
  { id: "8", name: "Zebra", category: "Animal" },
];

export default function CarrinhoComprador() {
  // State to hold the currently displayed (filtered) items
  const [filteredItems, setFilteredItems] = useState(initialItems);
  // State to hold the current search query
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
      <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.itemCategory, { color: colors.secondary }]}>
        {item.category}
      </Text>
    </View>
  );

  const { colors } = useTheme();
  //TODO: fazer as informacoes do pedido
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
          <Text>Valor</Text>
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
    fontSize: 18,
    fontWeight: "600",
  },
  itemCategory: {
    fontSize: 14,
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
    borderWidth: 2,
    borderRadius: 16,
  },
});
