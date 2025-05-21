import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

const DarkMode = () => {
  const { colors, toggleTheme, theme } = useTheme();
  return (
    <View style={{ position: "absolute", top: 30, right: 20 }}>
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          padding: 16,
          borderRadius: 24,
        }}
        onPress={toggleTheme}
      >
        {theme === "dark" ? (
          <Text style={{ fontWeight: "bold", fontSize: 30, color: "#FFFFFF" }}>
            <Feather name="moon" size={14} />
          </Text>
        ) : (
          <Text style={{ fontWeight: "bold", fontSize: 30, color: "#FFFFFF" }}>
            <Feather name="sun" size={14} />
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DarkMode;
