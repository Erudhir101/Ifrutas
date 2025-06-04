import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "../../hooks/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Preencha todos os campos!");
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      switch (user?.user_type) {
        case "comprador":
          router.replace("/(Comprador)/homeComprador");
          break;
        case "vendedor":
          router.replace("/(Vendedor)/homeVendedor");
          break;
        case "entregador":
          router.replace("/(Entregador)/homeEntregador");
          break;
      }
    } catch (error: any) {
      Alert.alert("Falha no Login", error.message || "Credenciais Inválidas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>login</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push("/passo-0");
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Esqueceu a senha?</Text>
        <Link href="./signup">
          <TouchableOpacity>
            <Text style={styles.signUpLink}>clique_aqui!!!</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  form: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 10,
    gap: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  demoCredentials: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#e8f4ff",
    borderRadius: 8,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  demoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: "#666",
  },
  signUpLink: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
  },
});
