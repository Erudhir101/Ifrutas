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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VoltarBotao from "@/components/VoltarBotao";
import { useTheme } from "@/hooks/useTheme";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

const listaProdutos = [
  {
    id: 2,
    name: "banana",
    value: 12,
    uri: "https://picsum.photos/seed/697/3000/2000",
  },
  {
    id: 3,
    name: "abacaxi",
    value: 42,
    uri: "https://picsum.photos/seed/697/3000/2000",
  },
  {
    id: 4,
    name: "pera",
    value: 62,
    uri: "https://picsum.photos/seed/697/3000/2000",
  },
  {
    id: 5,
    name: "uva",
    value: 52,
    uri: "https://picsum.photos/seed/697/3000/2000",
  },
  {
    id: 6,
    name: "maça",
    value: 32,
    uri: "https://picsum.photos/seed/697/3000/2000",
  },
  {
    id: 7,
    name: "melancia",
    value: 22,
    uri: "https://picsum.photos/seed/697/3000/2000",
  },
];

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
        <Image style={styles.image} source={{ uri: item.uri }} />
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
  const [products, setProducts] = useState(listaProdutos);
  const [modalVisible, setModalVisible] = useState(false);

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);

  const handleAddProduct = () => {
    // Basic validation
    if (!newProductName.trim() || !newProductPrice.trim() || !newImage) {
      Alert.alert(
        "Error",
        "Por favor inclua o Nome, Preço e Imagem do Produto!",
      );
      return;
    }

    const newProduct = {
      id: products.length + 1,
      name: newProductName.trim(),
      value: parseFloat(newProductPrice.trim()),
      uri: newImage,
    };

    setProducts([...products, newProduct]);
    setNewProductName("");
    setNewProductPrice("");
    setNewImage(null);
    setModalVisible(false);
    Alert.alert("Success", `${newProduct.name} adicionado na lista!`);
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

    if (!result.canceled) {
      setNewImage(result.assets[0].uri); // Set the URI of the selected image
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

    if (!result.canceled) {
      setNewImage(result.assets[0].uri);
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
        keyExtractor={(item) => `${item.id}`}
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
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.centeredView}
        >
          <View
            style={[
              styles.modalView,
              { backgroundColor: colors.background, shadowColor: colors.text },
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
                placeholder="Produto"
                placeholderTextColor="#999"
                value={newProductName}
                onChangeText={setNewProductName}
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
                placeholder="Preço"
                placeholderTextColor="#999"
                value={newProductPrice}
                onChangeText={setNewProductPrice}
                keyboardType="numeric"
              />
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
                    Pick from Gallery
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
                    Take Photo
                  </Text>
                </TouchableOpacity>
              </View>

              {newImage ? (
                <Image source={{ uri: newImage }} style={styles.previewImage} />
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
                  setNewProductName("");
                  setNewProductPrice("");
                  setNewImage(null);
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
    margin: 20,
    borderRadius: 20,
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
    width: "95%", // Make modal responsive
    maxWidth: 900, // Max width for larger screens
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
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  section: {
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
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
    justifyContent: "center",
    width: "100%",
    gap: 20,
  },
  modalButton: {
    height: 50,
    borderRadius: 10,
    elevation: 2,
    marginHorizontal: 5,
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
