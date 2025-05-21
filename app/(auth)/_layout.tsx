import React from "react";
import { Stack } from "expo-router";
import { CadastroProvider } from "../../hooks/CadastroContext";
import { AuthProvider } from "../../hooks/AuthContext"; // Importe seu AuthProvider

export default function CadastroLayout() {
  return (
    // Envolva com AuthProvider para que as telas de cadastro possam usar useAuth
    <AuthProvider>
      <CadastroProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="passo-0" />
          <Stack.Screen name="passo-1" />
          <Stack.Screen name="passo-2" />
          <Stack.Screen name="passo-3" />
          <Stack.Screen name="passo-4" />
          <Stack.Screen name="sucesso" />
        </Stack>
      </CadastroProvider>
    </AuthProvider>
  );
}
