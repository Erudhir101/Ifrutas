import React from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useCadastro } from "@/hooks/CadastroContext";
import { UserType } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import NavigationButtons from "@/components/NavigationButtons";

export default function Passo0Screen() {
  const { cadastroData, setCadastroData } = useCadastro();
  const { colors } = useTheme();

  const handleSelectUserType = (type: UserType) => {
    setCadastroData({ ...cadastroData, userType: type });
  };

  const handleNext = () => {
    if (cadastroData.userType) {
      router.push("./passo-1");
    } else {
      Alert.alert("Error", "Selecione o tipo do usuário");
    }
  };

  const isSelected = (type: UserType) => cadastroData.userType === type;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={styles.title}>Bem-vindo(a) ao Cadastro do IFrut!</Text>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          paddingBottom: 70,
        }}
      >
        <Text style={styles.sectionTitle}>
          Selecione o tipo de perfil desejado:
        </Text>
        <View style={styles.userTypeButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              isSelected("vendedor") && styles.selectedUserTypeButton,
            ]}
            onPress={() => handleSelectUserType("vendedor")}
          >
            <Text
              style={[
                styles.userTypeButtonText,
                isSelected("vendedor") && styles.selectedUserTypeButtonText,
              ]}
            >
              Vendedor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.userTypeButton,
              isSelected("comprador") && styles.selectedUserTypeButton,
            ]}
            onPress={() => handleSelectUserType("comprador")}
          >
            <Text
              style={[
                styles.userTypeButtonText,
                isSelected("comprador") && styles.selectedUserTypeButtonText,
              ]}
            >
              Comprador
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.userTypeButton,
              isSelected("entregador") && styles.selectedUserTypeButton,
            ]}
            onPress={() => handleSelectUserType("entregador")}
          >
            <Text
              style={[
                styles.userTypeButtonText,
                isSelected("entregador") && styles.selectedUserTypeButtonText,
              ]}
            >
              Entregador
            </Text>
          </TouchableOpacity>
        </View>

        <NavigationButtons
          onNextPress={handleNext}
          nextButtonActivate={!isSelected(null)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  title: {
    paddingTop: 24,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
    color: "#333",
  },
  userTypeButtonsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    gap: 4,
  },
  userTypeButton: {
    width: 140,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#007bff",
    backgroundColor: "#fff",
  },
  selectedUserTypeButton: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  userTypeButtonText: {
    textAlign: "center",
    color: "#007bff",
    fontSize: 16,
    fontWeight: "500",
  },
  selectedUserTypeButtonText: {
    color: "#fff",
  },
});
