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
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Product } from "@/lib/supabase";
import { useTheme } from "@/hooks/useTheme";

export default function Produto() {
  const { colors } = useTheme();
  const [quantidade, setQuantidade] = useState(0);
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

  const handlePurchase = () => {
    //TODO: fazer o handle, recriar o purchase para fazer a compra
    Alert.alert(
      "Adicionado!",
      `${quantidade}x ${produto?.name} foi adicionado ao carrinho.`,
    );
  };
  const handleTextChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const newQuantity = numericValue ? parseInt(numericValue, 10) : 1;
    setQuantidade(newQuantity < 1 ? 1 : newQuantity);
  };

  useEffect(() => {
    if (quantidade < 0 || quantidade > 99) setQuantidade(0);
  });
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            marginBottom: 30,
          }}
        >
          <View style={styles.qtdContainer}>
            <Text style={styles.qtdLabel}>Quantidade</Text>
            <View style={styles.qtdInput}>
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                {produto?.amount}
              </Text>
            </View>
          </View>

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
                disabled={quantidade <= 0}
                onPress={() => {
                  if (quantidade >= 0) setQuantidade(quantidade - 1);
                  else setQuantidade(0);
                }}
                style={styles.button}
              >
                <Text
                  style={[
                    styles.buttonText,
                    quantidade <= 0 && styles.buttonTextDisable,
                  ]}
                >
                  -
                </Text>
              </TouchableOpacity>

              {/* Input de Quantidade */}
              <TextInput
                style={styles.quantityInput}
                value={String(quantidade)} // O valor do input deve ser uma string
                onChangeText={handleTextChange}
                keyboardType="numeric" // Mostra o teclado numérico para o usuário
                textAlign="center"
              />

              {/* Botão de Aumentar */}
              <TouchableOpacity
                disabled={quantidade > 99}
                onPress={() => {
                  if (quantidade <= 99) setQuantidade(quantidade + 1);
                  else setQuantidade(99);
                }}
                style={styles.button}
              >
                <Text
                  style={[
                    styles.buttonText,
                    quantidade > 99 && styles.buttonTextDisable,
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 16 }}>
              <TouchableOpacity
                style={[styles.botao, { backgroundColor: colors.primary }]}
                onPress={() => {
                  handlePurchase();
                }}
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
