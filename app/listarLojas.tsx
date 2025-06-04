import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ListaLojas() {
  const router = useRouter();
  const lojas = [
    {
      id: 1,
      nome: "Sacolão da Fartura",
      endereco: "Shopping Itau, Centro de Itaquaquecetuba",
      distancia: "7Km de Distância",
    },
    {
      id: 2,
      nome: "Maxfruit",
      endereco: "Taguatinga Sul, Próximo a feira",
      distancia: "9Km de Distância",
    },
    {
      id: 3,
      nome: "Fresh Hortifruti",
      endereco: "Ceilândia centro, quadra 134, lote 7",
      distancia: "15Km de Distância",
    },
    {
      id: 4,
      nome: "Sacolão Ananás",
      endereco: "CSB 8, Lote 10",
      distancia: "10Km de Distância",
    },
  ];

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

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Hortifruti"
          placeholderTextColor="#999"
          style={styles.input}
        />
      </View>

      {/* Lista de Lojas */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {lojas.map((loja) => (
          <View key={loja.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Feather name="shopping-bag" size={28} color="#555" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{loja.nome}</Text>
                <Text style={styles.cardSub}>{loja.endereco}</Text>
                <View style={styles.distance}>
                  <Entypo name="location-pin" size={16} color="#888" />
                  <Text style={styles.distanceText}>{loja.distancia}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push(`/perfilVendedor?id=${loja.id}&nome=${encodeURIComponent(loja.nome)}&endereco=${encodeURIComponent(loja.endereco)}&distancia=${encodeURIComponent(loja.distancia)}`)}>
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
