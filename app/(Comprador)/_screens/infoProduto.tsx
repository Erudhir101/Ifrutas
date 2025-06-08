import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Product } from "@/lib/supabase";
import { useAuth } from "@/hooks/AuthContext";
import { usePurchases } from "@/hooks/purchaseContext";

export default function Produto() {
  const router = useRouter();
  const { user } = useAuth();
  const { getOrCreateOpenPurchase, addItemToPurchase } = usePurchases(user?.id);
  const [quantidade, setQuantidade] = useState(1); // valor inicial 1
  const [modal, setModal] = useState(false);

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

  const adicionarAoCarrinho = async () => {
    if (!user?.id || !produto?.id || !produto?.seller) {
      Alert.alert("Erro", "Dados do usuário ou produto ausentes.");
      return;
    }

    try {
      const purchase = await getOrCreateOpenPurchase(produto.seller);
      await addItemToPurchase(purchase.id, produto, quantidade);
      const updatedPurchase = await getOrCreateOpenPurchase(produto.seller);

      Alert.alert(
        "Adicionado!",
        `${quantidade}x ${produto?.name} foi adicionado ao carrinho.`,
        [
          {
            text: "OK",
            onPress: () => {
              setModal(false);
              router.push(
                `/(Comprador)/_screens/perfilVendedor?id=${produto.seller}`,
              );
            },
          },
        ],
      );
    } catch (e) {
      Alert.alert("Erro", "Não foi possível adicionar ao carrinho.");
    }
  };

  // Função para o input do modal
  const handleTextChange = (text: string) => {
    const valor = parseInt(text);
    if (isNaN(valor) || valor < 1) setQuantidade(1);
    else if (valor > 99) setQuantidade(99);
    else setQuantidade(valor);
  };

  // Função para o botão do modal
  const handlePurchase = () => {
    adicionarAoCarrinho();
  };

  // Validação de quantidade para evitar loops
  useEffect(() => {
    if (quantidade < 1) setQuantidade(1);
    if (quantidade > 99) setQuantidade(99);
  }, [quantidade]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (produto?.seller) {
              router.push(
                `/(Comprador)/_screens/perfilVendedor?id=${produto.seller}`,
              );
            } else {
              router.back();
            }
          }}
        >
          <Feather name="arrow-left" size={24} color="#555" />
        </TouchableOpacity>
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            marginBottom: 30,
          }}
        >
          {/* Preço */}
          <Text style={styles.preco}>R$ {produto?.price?.toFixed(2)}</Text>
        </View>

        {/* Botão */}
        <TouchableOpacity
          style={styles.botao}
          onPress={() => {
            setModal(true);
          }}
        >
          <Text style={styles.botaoTexto}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
      <Modal animationType="fade" transparent={true} visible={modal}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: "90%",
              backgroundColor: "#fafafa",
              borderRadius: 16,
              paddingHorizontal: 15,
              paddingVertical: 15,
              gap: 40,
            }}
          >
            <Text
              style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}
            >
              Selecione a Quantidade:
            </Text>
            <View style={styles.inputContainer}>
              {/* Botão de Diminuir */}
              <TouchableOpacity
                disabled={quantidade <= 1}
                onPress={() => setQuantidade(Math.max(1, quantidade - 1))}
                style={styles.button}
              >
                <Text
                  style={[
                    styles.buttonText,
                    quantidade <= 1 && styles.buttonTextDisable,
                  ]}
                >
                  -
                </Text>
              </TouchableOpacity>

              {/* Input de Quantidade */}
              <TextInput
                style={styles.quantityInput}
                value={String(quantidade)}
                onChangeText={handleTextChange}
                keyboardType="numeric"
                textAlign="center"
              />

              {/* Botão de Aumentar */}
              <TouchableOpacity
                disabled={quantidade >= 99}
                onPress={() => setQuantidade(Math.min(99, quantidade + 1))}
                style={styles.button}
              >
                <Text
                  style={[
                    styles.buttonText,
                    quantidade >= 99 && styles.buttonTextDisable,
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 16 }}>
              <TouchableOpacity
                style={[styles.botao, { backgroundColor: "#2ecc40" }]}
                onPress={handlePurchase}
              >
                <Text style={styles.botaoTexto}>Adicionar ao Carrinho</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => {
                  setModal(false);
                }}
              >
                <Text style={styles.botaoTexto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 32,
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
    fontSize: 18,
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
    fontSize: 13,
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
    fontSize: 30,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  botao: {
    backgroundColor: "#555",
    paddingVertical: 15,
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
  inputContainer: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    width: 150, // Largura do container
  },
  button: {
    width: 40,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  buttonTextDisable: {
    color: "#aaa",
  },
  quantityInput: {
    flex: 1, // Ocupa o espaço restante
    height: 40,
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    paddingHorizontal: 5,
  },
});
