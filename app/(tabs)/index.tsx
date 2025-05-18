import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Feather } from "@expo/vector-icons";

export default function TabOneScreen() {
  const { colors, toggleTheme, theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Tab One</Text>
      <View style={styles.separator} />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={toggleTheme}
      >
        {theme === "dark" ? (
          <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
            <Feather name="moon" size={14} />
          </Text>
        ) : (
          <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
            <Feather name="sun" size={14} />
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    padding: 16,
    borderRadius: 24,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 30,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
