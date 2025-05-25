import { Stack, Tabs } from "expo-router";
import "react-native-reanimated";
import { View, StyleSheet } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

export default function LayoutComprador() {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          animation: "shift",
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
          tabBarStyle: {
            height: 60,
            backgroundColor: colors.nav,
            borderTopWidth: 0, // Set borderTopWidth to 0
            shadowColor: "#000", // Black shadow for better visibility
            shadowOffset: { width: 0, height: -2 }, // Shadow coming from the top
            shadowOpacity: 0.1, // Adjust opacity
            shadowRadius: 5, // Adjust blur radius
            elevation: 8, // Adjust elevation value (higher value = more prominent shadow)
            paddingVertical: 5,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="homeComprador"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="carrinhoComprador"
          options={{
            title: "Carrinho",
            tabBarIcon: ({ color }) => (
              <Feather size={28} name="shopping-cart" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chatComprador"
          options={{
            title: "Chat",
            tabBarIcon: ({ color }) => (
              <Feather size={28} name="message-circle" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="contaComprador"
          options={{
            title: "Opções",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="cog" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
