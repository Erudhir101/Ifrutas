import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StyleSheet, Text } from "react-native";
import { useAuth } from "@/hooks/AuthContext";
import { usePurchases } from "@/hooks/purchaseContext";

export default function BottomTabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { getOpenPurchaseItemCount } = usePurchases(user?.id);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await getOpenPurchaseItemCount();
      setItemCount(count);
    };
    fetchCount();
    // Opcional: adicione um intervalo para atualizar o contador periodicamente
    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, [getOpenPurchaseItemCount]);

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          animation: "shift",
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
          tabBarStyle: {
            height: 60 + insets.bottom,
            backgroundColor: colors.nav,
            borderTopColor: colors.text,
            borderTopWidth: 0.5,
            paddingVertical: 5,
            paddingBottom: insets.bottom,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="homeComprador"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="home-outline" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="carrinhoComprador"
          options={{
            title: "Carrinho",
            tabBarIcon: ({ color }) => (
              <View>
                <Feather size={28} name="shopping-cart" color={color} />
                {itemCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{itemCount}</Text>
                  </View>
                )}
              </View>
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
              <FontAwesome size={28} name="user-o" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="_screens"
          options={{
            href: null, // Isso oculta a aba
          }}
        />
        {/* NÃO adicione listarLojas aqui! */}
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    zIndex: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});