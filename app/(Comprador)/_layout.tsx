import { Stack } from "expo-router";
import "react-native-reanimated";
import { ThemeProvider } from "../../components/ThemeContext.js";
import { AuthProvider } from "../../hooks/AuthContext";
import { StatusBar } from "expo-status-bar";

export default function layoutComprador() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="homeComprador" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
