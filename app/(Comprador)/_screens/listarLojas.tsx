import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useStore } from "@/hooks/LojaContext";
import { useEffect, useState } from "react";

export default function ListaLojas() {
  const router = useRouter();
  const { stores, fetchStores } = useStore();
  const [search, setSearch] = useState("");

  const lojasFiltradas = stores.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>

        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Hortifruti"
          placeholderTextColor="#999"
          style={styles.input}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {lojasFiltradas.map((loja) => (
          <View key={loja.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Feather name="shopping-bag" size={28} color="#555" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{loja.name}</Text>
                <Text style={styles.cardSub}>{loja.endereco}</Text>
                <View style={styles.distance}>
                  <Entypo name="location-pin" size={16} color="#888" />
                  <Text style={styles.distanceText}>
                    {Math.floor(Math.random() * 50) + 1} Km
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push(
                  `/(Comprador)/_screens/perfilVendedor?&id=${loja.id}&nome=${encodeURIComponent(loja.name)}&endereco=${encodeURIComponent(loja.endereco ?? "")}`,
                )
              }
            >
              <Text style={styles.buttonText}>Abrir</Text>
            </TouchableOpacity>
          </View>
        ))}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: "#333",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBox: {
    backgroundColor: "#EAEAEA",
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  cardSub: {
    fontSize: 13,
    color: "#888",
    marginVertical: 2,
  },
  distance: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  distanceText: {
    color: "#888",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#EAEAEA",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  buttonText: {
    color: "#333",
    fontWeight: "600",
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#EAEAEA",
    backgroundColor: "#fff",
  },
});