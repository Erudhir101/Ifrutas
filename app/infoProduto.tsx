import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Product } from "@/lib/supabase";

export default function Produto() {
  const [quantidade, setQuantidade] = useState(0);

  const params = useLocalSearchParams();
  const { item: itemString } = params;

  let produto: Product | null = null;
  try {
    if (itemString) {
      produto = JSON.parse(itemString);
    }
  } catch (e) {
    console.error("Erro ao fazer o parse do item JSON:", e);
  }

  const adicionarAoCarrinho = () => {
    Alert.alert(
      "Adicionado!",
      `${quantidade}x ${produto?.name} foi adicionado ao carrinho.`,
    );
    // Aqui futuramente você pode adicionar no contexto global ou AsyncStorage
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{produto?.name}</Text>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Detalhes do Produto */}
      <View style={styles.content}>
        <Text style={styles.subTitle}>{produto?.description}</Text>

        <View style={styles.imageBox}>
          {produto?.image ? (
            <Image
              source={{ uri: produto.image }}
              style={styles.previewImage}
            />
          ) : (
            <Feather name="box" size={24} color="#555" />
          )}
        </View>

        {/* Quantidade */}
        <View style={styles.qtdContainer}>
          <Text style={styles.qtdLabel}>Quantidade</Text>
          <TextInput
            style={styles.qtdInput}
            keyboardType="numeric"
            value={"" + produto?.amount}
            onChangeText={(text) => setQuantidade(parseInt(text))}
          />
        </View>

        {/* Preço */}
        <Text style={styles.preco}>R$ {produto?.price?.toFixed(2)}</Text>

        {/* Botão */}
        <TouchableOpacity style={styles.botao} onPress={adicionarAoCarrinho}>
          <Text style={styles.botaoTexto}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
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
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  subTitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  imageBox: {
    backgroundColor: "#EAEAEA",
    width: "100%",
    height: 160,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  qtdContainer: {
    marginBottom: 12,
  },
  qtdLabel: {
    color: "#999",
    fontSize: 12,
    marginBottom: 4,
  },
  qtdInput: {
    backgroundColor: "#EAEAEA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    width: 60,
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },
  preco: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  botao: {
    backgroundColor: "#555",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  previewImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    objectFit: "fill",
  },
});
