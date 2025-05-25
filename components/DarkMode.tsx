import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

const DarkMode = () => {
  const { colors, toggleTheme, theme } = useTheme();
  return (
    <View style={{ position: "absolute", top: 30, right: 20 }}>
      <TouchableOpacity
        style={{
          padding: 12,
          borderRadius: "100%",
          borderWidth: 2,
          borderEndColor: colors.text,
          borderStartColor: colors.text,
          borderBlockColor: colors.text,
        }}
        onPress={toggleTheme}
      >
        {theme === "dark" ? (
          <Text
            style={{ fontWeight: "bold", fontSize: 30, color: colors.text }}
          >
            <Feather name="sun" size={20} />
          </Text>
        ) : (
          <Text
            style={{ fontWeight: "bold", fontSize: 30, color: colors.text }}
          >
            <Feather name="moon" size={20} />
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DarkMode;
