import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ListarProdutos() {
  const router = useRouter();

  // TODO: Buscar produtos do Supabase futuramente
  // Exemplo futuro:
  // const [produtos, setProdutos] = useState<Produto[]>([]);
  // useEffect(() => {
  //   fetchProdutosRecomendados().then(setProdutos);
  // }, []);

  // Dados fictícios para exibição temporária
  const produtos = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    nome: `Produto ${i + 1}`,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.produtoTitulo}>Produtos</Text>
      {/*
        TODO: Substituir o array 'produtos' por dados vindos do Supabase.
        Utilizar useEffect para buscar produtos recomendados.
        Exemplo de função futura: fetchProdutosRecomendados()
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
            onPress={() => router.push({ pathname: "/infoProduto", params: { id: item.id } })}
          >
            <View style={styles.produtoIcon}>
              <Feather name="box" size={24} color="#555" />
            </View>
            <Text style={styles.produtoNome}>{item.nome}</Text>
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
    marginBottom: 12,
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
  },
});
