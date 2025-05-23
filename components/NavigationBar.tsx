import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Tab = "Inicio" | "Carrinho" | "Chat" | "Conta";

interface NavigationBarProps {
  activeTab: Tab;
  onTabPress?: (tab: Tab) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handlePress = (tab: Tab, route: string) => {
    onTabPress?.(tab);
    router.push(route);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress("Inicio", "/inicio")}
      >
        <Ionicons
          name="home-outline"
          size={26}
          color={activeTab === "Inicio" ? "#1E1E1E" : "#B8B8B8"}
        />
        <Text style={[styles.text, activeTab === "Inicio" && styles.activeText]}>Início</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress("Carrinho", "/carrinho")}
      >
        <MaterialIcons
          name="shopping-cart"
          size={26}
          color={activeTab === "Carrinho" ? "#1E1E1E" : "#B8B8B8"}
        />
        <Text style={[styles.text, activeTab === "Carrinho" && styles.activeText]}>Carrinho</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress("Chat", "/chat")}
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={26}
          color={activeTab === "Chat" ? "#1E1E1E" : "#B8B8B8"}
        />
        <Text style={[styles.text, activeTab === "Chat" && styles.activeText]}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handlePress("Conta", "/conta")}
      >
        <FontAwesome
          name="user-o"
          size={26}
          color={activeTab === "Conta" ? "#1E1E1E" : "#B8B8B8"}
        />
        <Text style={[styles.text, activeTab === "Conta" && styles.activeText]}>Conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 8,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    color: "#B8B8B8",
    marginTop: 2,
  },
  activeText: {
    color: "#1E1E1E",
    fontWeight: "bold",
  },
});

export default NavigationBar;