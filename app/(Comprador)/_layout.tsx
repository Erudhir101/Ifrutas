import { Stack } from "expo-router";
import "react-native-reanimated";
import { ThemeProvider } from "../../components/ThemeContext.js";
import { AuthProvider } from "../../hooks/AuthContext";
import { StatusBar } from "expo-status-bar";
import NavigationBar from "../../components/NavigationBar";
import { View, StyleSheet } from "react-native";

export default function layoutComprador() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <View style={styles.content}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="homeComprador" />
            </Stack>
          </View>
          <NavigationBar activeTab="Inicio" />
        </View>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
