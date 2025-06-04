import React from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useCadastro } from "../../hooks/CadastroContext";
import NavigationButtons from "@/components/NavigationButtons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";

export default function Passo2Screen() {
  const { cadastroData, setCadastroData } = useCadastro();
  const { colors } = useTheme();

  const handleNext = () => {
    if (cadastroData.email) {
      router.push("./passo-3");
    } else {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={styles.title}>Digite o seu E-mail</Text>
      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          paddingBottom: 110,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={cadastroData.email}
          onChangeText={(text) =>
            setCadastroData({ ...cadastroData, email: text })
          }
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <NavigationButtons
          onNextPress={handleNext}
          nextButtonActivate={cadastroData.email !== ""}
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
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,

    paddingTop: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 18,
    borderColor: "#ccc",
    borderRadius: 16,
    fontSize: 18,
    backgroundColor: "#E3DCDC",
    textAlign: "center",
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
