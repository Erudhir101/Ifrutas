import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useCadastro } from "../../hooks/CadastroContext";
import NavigationButtons from "@/components/NavigationButtons";
import { SafeAreaView } from "react-native-safe-area-context";

const STRENGTH_LEVELS = [
  { label: "Muito Fraca", color: "#dc3545", score: 0 },
  { label: "Fraca", color: "#ffc107", score: 20 },
  { label: "Moderada", color: "#007bff", score: 40 },
  { label: "Forte", color: "#28a745", score: 60 },
  { label: "Muito Forte", color: "#20c997", score: 100 },
];

export default function Passo3Screen() {
  const [confirm, setConfirm] = useState("");
  const { cadastroData, setCadastroData } = useCadastro();
  const [passwordStrength, setpasswordStrength] = useState(STRENGTH_LEVELS[0]);

  const handleNext = () => {
    if (verifiedPassword()) {
      router.push("./passo-4");
    } else {
      Alert.alert("Error", "A senha deve ter pelo menos 6 caracteres.");
    }
  };

  function verifiedPassword() {
    return (
      cadastroData.password.length >= 6 && cadastroData.password === confirm
    );
  }

  function calculateStrength(password: string) {
    let score = 0;
    let scoreLevel;
    if (password.length >= 6) score += 2;
    if (password.length >= 12) score += 2;

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (hasLowercase && hasUppercase) score += 1;
    if (hasNumber) score += 1;
    if (hasSymbol) score += 1;
    if (hasLowercase && hasUppercase && hasNumber && hasSymbol) score += 3;

    switch (score) {
      case 0:
      case 1:
        scoreLevel = STRENGTH_LEVELS[0];
        break;
      case 2:
      case 3:
        scoreLevel = STRENGTH_LEVELS[1];
        break;
      case 4:
      case 5:
        scoreLevel = STRENGTH_LEVELS[2];
        break;
      case 6:
      case 7:
        scoreLevel = STRENGTH_LEVELS[3];
        break;
      case 8:
      default:
        scoreLevel = STRENGTH_LEVELS[4];
        break;
    }
    return scoreLevel;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Agora, crie uma senha</Text>
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
          placeholder="Senha"
          value={cadastroData.password}
          onChangeText={(text) => {
            setCadastroData({ ...cadastroData, password: text });
            setpasswordStrength(calculateStrength(text));
          }}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirme sua senha"
          value={confirm}
          onChangeText={(text) => setConfirm(text)}
          secureTextEntry
        />
        <View style={styles.barContainer}>
          {cadastroData.password.length > 0 && ( // Só mostra o medidor se a senha não estiver vazia
            <>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${passwordStrength.score}%`, // Largura baseada no score
                      backgroundColor: passwordStrength.color, // Cor baseada no nível de força
                    },
                  ]}
                />
              </View>
              <Text
                style={[styles.strengthText, { color: passwordStrength.color }]}
              >
                Senha {passwordStrength.label}
              </Text>
            </>
          )}
        </View>
        <NavigationButtons
          onNextPress={handleNext}
          nextButtonActivate={verifiedPassword()}
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
  barContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 80,
  },
  progressBarBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden", // Garante que a barra de preenchimento não saia dos limites
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  strengthText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
  },
});
