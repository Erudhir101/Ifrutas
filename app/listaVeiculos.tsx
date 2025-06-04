import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VoltarBotao from "@/components/VoltarBotao";
import { useTheme } from "@/hooks/useTheme";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  createVehicle,
  deleteVehicle,
  fetchVehicles,
  Vehicle,
} from "@/lib/vehicle";
import { useAuth } from "@/hooks/AuthContext";

export default function ListaVeiculos() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [visibleModal, setVisibleModal] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle>({
    brand: "",
    model: "",
    plate: "",
    year: "",
    type: "carro",
    id_deliveryman: user?.id ?? "",
  });

  const loadVehicles = async () => {
    const fetched = await fetchVehicles(vehicle.id_deliveryman);
    setVehicles(fetched);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const types: (typeof vehicle.type)[] = ["carro", "bicicleta", "moto"];

  const handleChange = (field: keyof Vehicle, value: string | null) => {
    setVehicle((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  async function handleAddVehicle() {
    if (!vehicle) return;
    if (!vehicle.brand || !vehicle.model || !vehicle.plate || !vehicle.year) {
      Alert.alert(
        "Error",
        "Por favor inclua a Placa, Marca, Modelo e Ano do veículo!",
      );
      return;
    }
    try {
      setIsLoading(true);
      const newVehicle = await createVehicle(vehicle);

      if (newVehicle) {
        setVehicles((prev) => [...prev, newVehicle]);
        Alert.alert("Sucesso", `${newVehicle.model} adicionado à lista!`);
        // Limpar formulário e imagem
        setVehicle({
          brand: "",
          model: "",
          plate: "",
          year: "",
          type: "carro",
          id_deliveryman: "",
        });
        setVisibleModal(false);
        setIsLoading(false);
      } else {
        Alert.alert("Erro", "Não foi possível adicionar o veiculo.");
      }
    } catch (error: any) {
      console.error("Erro ao adicionar veiculo no componente:", error.message);
      Alert.alert(
        "Erro",
        `Não foi possível adicionar o veiculo: ${error.message}`,
      );
    }
  }

  async function handleDeleteVehicle(id: number) {
    if (!vehicles[id]) return;
    setIsLoading(true);
    await deleteVehicle(vehicles[id]);
    setVehicles(vehicles.filter((_, idx) => idx !== id));
    setVehicle({
      brand: "",
      model: "",
      plate: "",
      year: "",
      type: "carro",
      id_deliveryman: "",
    });
    setVisibleModal(false);
    setIsLoading(false);
  }

  function ItemList({ item, index }: { item: Vehicle; index: number }) {
    return (
      <View style={styles.itemContainer}>
        {(() => {
          switch (item.type) {
            case "carro":
              return (
                <FontAwesome6 name="car-side" size={24} color={colors.text} />
              );
            case "bicicleta":
              return (
                <MaterialIcons
                  name="pedal-bike"
                  size={30}
                  color={colors.text}
                />
              );
            case "moto":
              return (
                <FontAwesome6 name="motorcycle" size={24} color={colors.text} />
              );
            default:
              return null;
          }
        })()}
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.text,
            }}
          >
            {item.model}
          </Text>
          <Text
            style={{ fontSize: 14, fontWeight: "light", color: colors.text }}
          >
            {item.plate}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleDeleteVehicle(index);
          }}
        >
          {isloading ? (
            <ActivityIndicator color="white" />
          ) : (
            <FontAwesome6 name="trash-alt" size={24} color="#FF4D4D" />
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          gap: 30,
          paddingVertical: 25,
          paddingHorizontal: 15,
          backgroundColor: colors.nav,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <VoltarBotao />
        <Text style={[styles.title, { color: colors.text }]}>
          Veículos Registrados
        </Text>
      </View>
      <View style={styles.addButton}>
        <TouchableOpacity
          onPress={() => setVisibleModal(true)}
          style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
        >
          <FontAwesome6 name="plus" size={20} color={colors.primary} />
          <Text
            style={{ color: colors.text, fontSize: 16, fontWeight: "bold" }}
          >
            Adicionar um Novo Veículo
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.listContent}
        data={vehicles}
        renderItem={({ item, index }) => <ItemList item={item} index={index} />}
        keyExtractor={(item) => item.plate}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <Text style={[styles.listContent, { color: colors.card }]}>
            No items found.
          </Text>
        )}
      />

      <Modal animationType="fade" transparent={true} visible={visibleModal}>
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
              <View style={styles.typeButtons}>
                <Text style={styles.titleType}>Tipo de Veículo</Text>
                <View style={styles.optionContainer}>
                  {types.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.buttonType,
                        { backgroundColor: colors.nav },
                        vehicle.type === type && {
                          backgroundColor: colors.secondary,
                        },
                      ]}
                      onPress={() => handleChange("type", type)}
                    >
                      {(() => {
                        switch (type) {
                          case "carro":
                            return (
                              <>
                                <FontAwesome6
                                  name="car"
                                  size={24}
                                  color={
                                    vehicle.type === type
                                      ? colors.nav
                                      : colors.text
                                  }
                                />
                                <Text
                                  style={[
                                    styles.optionText,
                                    vehicle.type === type && {
                                      color: colors.nav,
                                    },
                                  ]}
                                >
                                  Carro
                                </Text>
                              </>
                            );
                          case "bicicleta":
                            return (
                              <>
                                <MaterialIcons
                                  name="pedal-bike"
                                  size={30}
                                  color={
                                    vehicle.type === type
                                      ? colors.nav
                                      : colors.text
                                  }
                                />
                                <Text
                                  style={[
                                    styles.optionText,
                                    vehicle.type === type && {
                                      color: colors.nav,
                                    },
                                  ]}
                                >
                                  Bike
                                </Text>
                              </>
                            );
                          case "moto":
                            return (
                              <>
                                <FontAwesome6
                                  name="motorcycle"
                                  size={24}
                                  color={
                                    vehicle.type === type
                                      ? colors.nav
                                      : colors.text
                                  }
                                />
                                <Text
                                  style={[
                                    styles.optionText,
                                    vehicle.type === type && {
                                      color: colors.nav,
                                    },
                                  ]}
                                >
                                  Moto
                                </Text>
                              </>
                            );
                          default:
                            return null;
                        }
                      })()}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.form}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    marginBottom: -5,
                    marginLeft: 5,
                  }}
                >
                  Placa
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="ABC-1234"
                  placeholderTextColor={"#ADAEBC"}
                  value={vehicle.plate}
                  onChangeText={(text) => handleChange("plate", text)}
                  keyboardType="default"
                  autoCapitalize="characters"
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    marginBottom: -5,
                    marginLeft: 5,
                  }}
                >
                  Marca
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o nome da marca"
                  placeholderTextColor={"#ADAEBC"}
                  value={vehicle.brand}
                  onChangeText={(text) => handleChange("brand", text)}
                  keyboardType="default"
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    marginBottom: -5,
                    marginLeft: 5,
                  }}
                >
                  Modelo
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o nome do modelo"
                  placeholderTextColor={"#ADAEBC"}
                  value={vehicle.model}
                  onChangeText={(text) => handleChange("model", text)}
                  keyboardType="default"
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    marginBottom: -5,
                    marginLeft: 5,
                  }}
                >
                  Ano
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="2025"
                  placeholderTextColor={"#ADAEBC"}
                  value={vehicle.year}
                  onChangeText={(text) => handleChange("year", text)}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.cancelButton]}
                  disabled={isloading}
                  onPress={() => {
                    setVisibleModal(false);
                    setVehicle({
                      model: "",
                      brand: "",
                      plate: "",
                      year: "",
                      type: "carro",
                      id_deliveryman: "",
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
                  onPress={handleAddVehicle}
                >
                  <Text style={[styles.buttonText, { color: colors.text }]}>
                    {isloading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.buttonText}>Cadastrar Veículo</Text>
                    )}
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
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    gap: 25,
  },
  addButton: {
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  listContent: {
    width: "100%",
    paddingHorizontal: 15,
    gap: 15,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  centeredView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
    color: "#333",
  },
  typeButtons: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    gap: 20,
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
  buttonType: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  titleType: {
    fontSize: 25,
    fontWeight: "bold",
  },
  optionContainer: {
    flexDirection: "row",
    gap: 15,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "bold",
  },

  form: {
    alignSelf: "stretch",
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
});
