import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons"; // Importe o FontAwesome6

export default function SucessoScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(Comprador)/homeComprador"); // Redireciona após 3 segundos
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu pedido foi Entregue com Sucesso!</Text>
      <FontAwesome6 name="circle-check" size={150} color="#28a745" />
      <ActivityIndicator size="large" color="#007bff" style={styles.spinner} />
      <Text style={styles.redirectingText}>Continue no nosso aplicativo para continuar recebendo os melhores pordutos na sua casa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
    gap: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#28a745",
    textAlign: "center",
  },
  spinner: {
    marginTop: 20,
    marginBottom: 10,
  },
  redirectingText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});
