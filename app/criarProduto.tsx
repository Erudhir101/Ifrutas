import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VoltarBotao from "@/components/VoltarBotao";
import { useTheme } from "@/hooks/useTheme";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Product, Category, Measure } from "@/lib/supabase";
import { useAuth } from "@/hooks/AuthContext";
import { Picker } from "@react-native-picker/picker";
import { createProduct, fetchProducts } from "@/lib/product";

function Item({ item, colors }) {
  return (
    <>
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: colors.card, width: 71, height: 60 },
        ]}
        onPress={() => alert(`You pressed ${item.name}`)}
      >
        <Image style={styles.image} source={{ uri: item.image }} />
        <Text
          style={{
            color: colors.text,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {item.name}
        </Text>
        <EvilIcons
          name="pencil"
          size={36}
          color={colors.secondary}
          style={{ position: "absolute", top: -19, right: -5 }}
        />
      </TouchableOpacity>
    </>
  );
}

export default function CriarProduto() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<
    Omit<Product, "id" | "image" | "created_at" | "updated_at">
  >({
    name: "",
    description: "",
    price: null,
    amount: null,
    available: true,
    seller: user?.id ?? null,
    category: null,
    measure: null,
  });

  const loadProducts = async () => {
    const fetched = await fetchProducts();
    setProducts(fetched);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (
    field: keyof Product,
    value: string | number | boolean | null,
  ) => {
    setProduct((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleAddProduct = async () => {
    if (!product) return;
    if (
      !product.name?.trim() ||
      !product.description?.trim() ||
      !product.price ||
      !product.amount ||
      !product.category ||
      !product.measure ||
      !product.seller ||
      !imageUri
    ) {
      Alert.alert(
        "Error",
        "Por favor inclua o Nome, Preço e Imagem do Produto!",
      );
      return;
    }

    try {
      const newProduct = await createProduct(product, imageUri);

      if (newProduct) {
        setProducts((prev) => [...prev, newProduct]);
        Alert.alert("Sucesso", `${newProduct.name} adicionado à lista!`);
        // Limpar formulário e imagem
        setProduct({
          name: "",
          description: "",
          price: null,
          amount: null,
          available: true,
          seller: user?.id ?? null,
          category: null,
          measure: null,
        });
        setImageUri(null);
        setModalVisible(false);
      } else {
        Alert.alert("Erro", "Não foi possível adicionar o produto.");
      }
    } catch (error: any) {
      console.error("Erro ao adicionar produto no componente:", error.message);
      Alert.alert(
        "Erro",
        `Não foi possível adicionar o produto: ${error.message}`,
      );
    }
  };

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão Requerida",
          "Desculpe, nós precisamos da permissão dos arquivos para funcionar",
        );
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && product) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão Requerida",
          "Desculpe, nós precisamos da permissão da câmera para funcionar!",
        );
        return;
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && product) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignSelf: "flex-start" }}>
        <VoltarBotao />
      </View>
      <Text style={{ fontWeight: "bold", fontSize: 25, color: colors.text }}>
        Lista de Produtos
      </Text>
      <FlatList
        data={products}
        renderItem={({ item }) => <Item item={item} colors={colors} />}
        keyExtractor={(item) => `${item.created_at}`}
        numColumns={4}
        contentContainerStyle={styles.items}
        columnWrapperStyle={styles.wrapper}
      />
      <TouchableOpacity
        style={{
          width: "80%",
          backgroundColor: colors.primary,
          borderRadius: 12,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={{
            color: colors.nav,
            textAlign: "center",
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          Adicionar Produto
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal foi fechado.");
          setModalVisible(!modalVisible);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.centeredView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View
              style={[
                styles.modalView,
                {
                  backgroundColor: colors.background,
                  shadowColor: colors.text,
                },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Crie um Novo Produto
              </Text>

              <View style={[styles.inputs]}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Nome do Produto"
                  placeholderTextColor="#999"
                  value={product.name || ""}
                  onChangeText={(text) => handleChange("name", text)}
                  autoCapitalize="words"
                />
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                  multiline
                  numberOfLines={3}
                  placeholder="Descrição do Produto"
                  placeholderTextColor="#999"
                  value={product.description || ""}
                  onChangeText={(text) => handleChange("description", text)}
                />
                <View
                  style={{
                    flexDirection: "row",
                    gap: 16,
                  }}
                >
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        textAlign: "center",
                        width: 200,
                      },
                    ]}
                    placeholder="Preço"
                    placeholderTextColor="#999"
                    value={product.price !== null ? String(product.price) : ""}
                    onChangeText={(text) =>
                      handleChange("price", parseFloat(text) || null)
                    }
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                    placeholder="Quantidade"
                    placeholderTextColor="#999"
                    value={
                      product.amount !== null ? String(product.amount) : ""
                    }
                    onChangeText={(text) =>
                      handleChange("amount", parseInt(text) || null)
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    gap: 16,
                  }}
                >
                  <View
                    style={[
                      styles.pickerContainer,
                      {
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
                    <Picker
                      selectedValue={product.category ?? undefined}
                      onValueChange={(itemValue: Category) =>
                        handleChange("category", itemValue)
                      }
                      style={{ color: colors.text }}
                      itemStyle={{ color: colors.text }} // Estilo para os itens no Android
                    >
                      <Picker.Item
                        label="Categoria"
                        value={null}
                        enabled={false}
                        style={{ color: "#999" }}
                      />
                      {[
                        "Frutas",
                        "Verduras",
                        "Legumes",
                        "Temperos",
                        "Graos",
                        "Organicos",
                        "Laticinios",
                        "Ovos",
                        "Ervas",
                        "Outros",
                      ].map((category) => (
                        <Picker.Item
                          key={category}
                          label={category.toUpperCase()}
                          value={category}
                        />
                      ))}
                    </Picker>
                  </View>

                  <View
                    style={[
                      styles.pickerContainer,
                      {
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
                    <Picker
                      selectedValue={product.measure ?? undefined}
                      onValueChange={(itemValue: Measure) =>
                        handleChange("measure", itemValue)
                      }
                      style={{ color: colors.text }}
                      itemStyle={{ color: colors.text }} // Estilo para os itens no Android
                    >
                      <Picker.Item
                        label="Medida"
                        value={null}
                        enabled={false}
                        style={{ color: "#999" }}
                      />
                      {[
                        "kilograma (kg)",
                        "grama (g)",
                        "unidade",
                        "cacho",
                        "maca",
                        "bandeja",
                        "duzia",
                        "pacote",
                        "litro (l)",
                        "mililitros (ml)",
                      ].map((measure) => (
                        <Picker.Item
                          key={measure}
                          label={measure.toUpperCase()}
                          value={measure}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.section,
                  {
                    backgroundColor: colors.background,
                    shadowColor: colors.text,
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Escolha uma Imagem do Produto
                </Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.pickerButton,
                      {
                        backgroundColor: colors.primary,
                        shadowColor: colors.text,
                      },
                    ]}
                    onPress={pickImage}
                  >
                    <FontAwesome name="image" size={24} color={colors.nav} />
                    <Text
                      style={[styles.pickerButtonText, { color: colors.nav }]}
                    >
                      Escolha da galeria
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pickerButton,
                      {
                        backgroundColor: colors.primary,
                        shadowColor: colors.text,
                      },
                    ]}
                    onPress={takePhoto}
                  >
                    <FontAwesome name="camera" size={24} color={colors.nav} />
                    <Text
                      style={[styles.pickerButtonText, { color: colors.nav }]}
                    >
                      Tire a Foto
                    </Text>
                  </TouchableOpacity>
                </View>

                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.previewImage}
                  />
                ) : (
                  <Text style={styles.noImageText}>
                    Nenhuma imagem selecionada!
                  </Text>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    setProduct({
                      name: "",
                      description: "",
                      price: null,
                      amount: null,
                      available: true,
                      seller: user?.id ?? null,
                      category: null,
                      measure: null,
                    });
                  }}
                >
                  <Text style={[styles.buttonText, { color: colors.text }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleAddProduct}
                >
                  <Text style={[styles.buttonText, { color: colors.text }]}>
                    Criar Produto
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  scrollContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    justifyContent: "space-between",
    marginBottom: 21,
  },
  items: {
    gap: 17,
    paddingVertical: 33,
    paddingHorizontal: 10,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background overlay
  },
  modalView: {
    borderRadius: 20,
    marginTop: 16,
    padding: 35,
    alignItems: "center",
    gap: 50,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    maxWidth: 900,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  inputs: {
    width: "100%",
    gap: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  pickerContainer: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
  },
  section: {
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonContainer: {
    width: "85%",
    justifyContent: "center",
    gap: 20,
  },
  modalButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  pickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  pickerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
    marginTop: 10,
    borderColor: "#eee",
    borderWidth: 1,
  },
  noImageText: {
    marginTop: 10,
    color: "#888",
    fontStyle: "italic",
  },
  image: {
    width: 60,
    height: 60,
    aspectRatio: 1,
    borderColor: "#eee",
    borderRadius: 16,
  },
});
