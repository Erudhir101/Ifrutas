import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VoltarBotao from "@/components/VoltarBotao";
import { useTheme } from "@/hooks/useTheme";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Category, Measure, Product, UserProfile } from "@/lib/supabase";
import { useAuth } from "@/hooks/AuthContext";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/lib/product";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { ColorPalette } from "@/constants/theme";

export default function CriarProduto() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<"add" | "update">("add");
  const [index, setIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<
    Omit<Product, "id" | "created_at" | "updated_at">
  >({
    name: "",
    description: "",
    price: null,
    amount: null,
    available: true,
    seller: user?.id ?? null,
    category: null,
    measure: null,
    image: null,
  });

  const loadProducts = async () => {
    const fetched = await fetchProducts(user?.id ?? "");
    setProducts(fetched);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  function Item({ item, index }: { item: Product; index: number }) {
    return (
      <>
        <TouchableOpacity
          style={[
            styles.item,
            { backgroundColor: colors.card, width: 71, height: 60 },
          ]}
          onPress={() => {
            setType("update");
            setProduct(item);
            setIndex(index);
            setModalVisible(true);
          }}
        >
          <Image
            style={styles.image}
            source={{ uri: item.image ?? undefined }}
          />
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
        renderItem={({ item, index }) => <Item item={item} index={index} />}
        keyExtractor={(item) => `${item.id}`}
        numColumns={3}
        contentContainerStyle={styles.items}
        columnWrapperStyle={styles.wrapper}
      />
      <TouchableOpacity
        style={{
          width: "80%",
          backgroundColor: colors.primary,
          borderRadius: 12,
        }}
        onPress={() => {
          setType("add");
          setModalVisible(true);
        }}
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
      <ModalProduct
        user={user}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        index={index}
        setIndex={setIndex}
        product={product}
        setProduct={setProduct}
        products={products}
        setProducts={setProducts}
        type={type}
        colors={colors}
      />
    </SafeAreaView>
  );
}

function ModalProduct({
  user,
  modalVisible,
  setModalVisible,
  index,
  setIndex,
  type,
  product,
  setProduct,
  products,
  setProducts,
  colors,
}: {
  user: UserProfile | null;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  type: "add" | "update";
  product: Omit<Product, "id" | "created_at" | "updated_at">;
  setProduct: React.Dispatch<
    React.SetStateAction<Omit<Product, "id" | "created_at" | "updated_at">>
  >; //
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  colors: ColorPalette;
}) {
  const [isloading, setIsLoading] = useState(false);

  const handleChange = (
    field: keyof Product,
    value: string | number | boolean | null,
  ) => {
    setProduct((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  function verifiedProduct(obj1, obj2) {
    if (
      typeof obj1 !== "object" ||
      obj1 === null ||
      typeof obj2 !== "object" ||
      obj2 === null
    ) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  async function handleAddProduct() {
    if (!product) return;
    if (
      !product.name?.trim() ||
      !product.description?.trim() ||
      !product.price ||
      !product.amount ||
      !product.category ||
      !product.measure ||
      !product.seller ||
      !product.image
    ) {
      Alert.alert(
        "Error",
        "Por favor inclua o Nome, Preço e Imagem do Produto!",
      );
      return;
    }

    try {
      setIsLoading(true);
      const newProduct = await createProduct(product, product.image);

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
          image: null,
        });
        setModalVisible(false);
        setIsLoading(false);
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
  }

  async function handleUpdateProduct() {
    if (!product) return;
    if (
      !product.name?.trim() ||
      !product.description?.trim() ||
      !product.price ||
      !product.amount ||
      !product.category ||
      !product.measure ||
      !product.seller ||
      !product.image
    ) {
      Alert.alert(
        "Error",
        "Por favor inclua o Nome, Preço e Imagem do Produto!",
      );
      return;
    }
    handleChange("name", product.name.trim());
    handleChange("description", product.description.trim());

    if (verifiedProduct(product, products[index])) {
      Alert.alert("Error", "Por favor modifique o valor do Produto!");
      return;
    }

    try {
      const update = await updateProduct(
        product,
        products[index],
        product.image,
      );

      if (update) {
        setIsLoading(true);
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === update.id ? update : product,
          ),
        );
        Alert.alert("Sucesso", `${update.name} Atualizado à lista!`);
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
          image: null,
        });
        setModalVisible(false);
        setIsLoading(false);
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
  }
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
      handleChange("image", result.assets[0].uri);
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
      handleChange("image", result.assets[0].uri);
    }
  };

  async function handleDeleteProduct() {
    if (!products[index]) return;
    setIsLoading(true);
    await deleteProduct(products[index]);
    setProducts(products.filter((_, idx) => idx !== index));
    setProduct({
      name: "",
      description: "",
      price: null,
      amount: null,
      available: true,
      seller: user?.id ?? null,
      category: null,
      measure: null,
      image: null,
    });
    setModalVisible(false);
    setIsLoading(false);
  }

  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
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
            {type === "add" ? null : (
              <TouchableOpacity
                disabled={isloading}
                style={[
                  styles.pickerButton,
                  {
                    backgroundColor: colors.secondary,
                    shadowColor: colors.text,
                    borderRadius: 20,
                    position: "absolute",
                    top: 2,
                    right: 2,
                  },
                ]}
                onPress={handleDeleteProduct}
              >
                {isloading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <FontAwesome name="trash-o" size={14} color={colors.nav} />
                    <Text
                      style={[
                        styles.pickerButtonText,
                        { color: colors.nav, fontSize: 12 },
                      ]}
                    >
                      Excluir Produto
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {type === "add" ? "Crie um Novo Produto" : "Atualize o Produto"}
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
                      width: 180,
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
                      flex: 1,
                    },
                  ]}
                  placeholder="Quantidade"
                  placeholderTextColor="#999"
                  value={product.amount !== null ? String(product.amount) : ""}
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
                    Galeria
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

              {product.image ? (
                <Image
                  source={{ uri: product.image }}
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
                style={[styles.cancelButton]}
                disabled={isloading}
                onPress={() => {
                  setModalVisible(false);
                  setIndex(0);
                  setProduct({
                    name: "",
                    description: "",
                    price: null,
                    amount: null,
                    available: true,
                    seller: user?.id ?? null,
                    category: null,
                    measure: null,
                    image: null,
                  });
                }}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>
                  {isloading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Cancelar</Text>
                  )}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton]}
                disabled={isloading}
                onPress={() => {
                  if (type === "add") {
                    handleAddProduct();
                  } else {
                    handleUpdateProduct();
                  }
                }}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>
                  {isloading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>
                      {type === "add" ? "Criar Produto" : "Atualizar Produto"}
                    </Text>
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  wrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 30,
  },
  image: {
    width: 60,
    height: 60,
    aspectRatio: 1,
    borderColor: "#eee",
    borderRadius: 16,
  },
  items: {
    gap: 25,
    paddingVertical: 33,
    paddingHorizontal: 10,
  },
  item: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background overlay
  },
  modalView: {
    borderRadius: 20,
    marginTop: 16,
    padding: 25,
    alignItems: "center",
    gap: 50,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  scrollContent: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    paddingTop: 15,
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
    padding: 20,
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
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  modalButton: {
    borderRadius: 10,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 15,
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 15,
    justifyContent: "center",
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
});
