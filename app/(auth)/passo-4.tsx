import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useCadastro } from "../../hooks/CadastroContext";
import { useAuth } from "../../hooks/AuthContext";
import NavigationButtons from "@/components/NavigationButtons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Passo4Screen() {
  const { cadastroData, setCadastroData, resetCadastroData } = useCadastro();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!cadastroData.endereco || !cadastroData.telefone) {
      Alert.alert("Erro", "Por favor, preencha endereço e telefone.");
      return;
    }

    setLoading(true);
    try {
      await signUp(
        cadastroData.email,
        cadastroData.password,
        cadastroData.userType,
        cadastroData.fullName,
        cadastroData.endereco,
        cadastroData.telefone,
      );
      resetCadastroData();
      router.replace("./sucesso");
    } catch (error: any) {
      console.error("Erro ao finalizar cadastro:", error.message);
      Alert.alert(
        "Erro no Cadastro",
        error.message || "Ocorreu um erro ao tentar cadastrar.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Contato e Endereço</Text>
      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: 32,
          paddingBottom: 50,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Endereço Completo"
          value={cadastroData.endereco}
          onChangeText={(text) =>
            setCadastroData({ ...cadastroData, endereco: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={cadastroData.telefone}
          onChangeText={(text) =>
            setCadastroData({ ...cadastroData, telefone: text })
          }
          keyboardType="phone-pad"
        />
        <NavigationButtons
          onNextPress={handleSubmit}
          nextButtonActivate={
            cadastroData.endereco !== "" && cadastroData.telefone !== ""
          }
        />
      </View>
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
});
