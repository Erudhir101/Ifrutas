import { Tabs } from "expo-router";
import "react-native-reanimated";
import { View, StyleSheet } from "react-native";
import { Feather, FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

export default function LayoutEntregador() {
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
            borderTopColor: colors.text,
            borderTopWidth: 0.5,
            paddingVertical: 5,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="homeVendedor"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="home-outline" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pedidosVendedor"
          options={{
            title: "Pedidos",
            tabBarIcon: ({ color }) => (
              <Octicons size={28} name="checklist" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chatVendedor"
          options={{
            title: "Chat",
            tabBarIcon: ({ color }) => (
              <Feather size={28} name="message-circle" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="contaVendedor"
          options={{
            title: "Opções",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="user-o" color={color} />
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
