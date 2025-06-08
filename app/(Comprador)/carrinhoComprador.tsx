import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { usePurchases } from "@/hooks/purchaseContext";
import { useAuth } from "@/hooks/AuthContext"; // <-- adicione esta linha
import { useFocusEffect } from "expo-router";
import { useTracking } from "@/hooks/RastreioContext";

export default function Carrinho() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets(); // <-- já está no seu código
  const router = useRouter();

  const [search, setSearch] = useState(""); // <-- Adicione esta linha

  const {
    getLastOpenPurchase,
    isLoading,
    removeItemFromPurchase,
    markPurchaseAsPaid,
  } = usePurchases(user?.id); // <-- use o id do usuário
  const { createTracking } = useTracking();
  const [purchase, setPurchase] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPurchase = async () => {
        const result = await getLastOpenPurchase();
        setPurchase(result);
      };
      fetchPurchase();
    }, [getLastOpenPurchase])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const result = await getLastOpenPurchase();
    setPurchase(result);
    setRefreshing(false);
  }, [getLastOpenPurchase]);

  const carrinho = purchase?.purchase_products || [];

  const total = carrinho.reduce(
    (sum: number, item: any) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0
  );

  const removerItem = async (productId: string) => {
    if (!purchase?.id) return;
    await removeItemFromPurchase(purchase.id, productId);
    // Atualize a lista após remover
    const result = await getLastOpenPurchase();
    setPurchase(result);
  };

  const comprar = async () => {
    if (!purchase?.id) return;

    try {
      // 1. Marcar a purchase como paga
      await markPurchaseAsPaid(purchase.id);

      // 2. Criar tracking com status pendente e sem entregador
      const tracking = await createTracking(
        purchase.id,
        null, // deliveryPersonId indefinido
        null  // estimatedTime indefinido
      );

      // 3. Navegar para a tela de acompanhamento, passando o trackingId
      if (tracking && tracking.id) {
        router.push({
          pathname: "/(Comprador)/_screens/acompanharPedido",
          params: { id: tracking.id }, // Passa só o ID do tracking
        });
      }
    } catch (e) {
      Alert.alert("Erro", "Não foi possível finalizar a compra.");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.card }]}>
      <View style={styles.itemInfo}>
        <View style={styles.itemIcon}>
          {item.product?.image ? (
            <Image
              source={{ uri: item.product.image }}
              style={{ width: 48, height: 48, borderRadius: 12 }}
            />
          ) : (
            <Feather name="box" size={32} color={colors.secondary} />
          )}
        </View>
        <View>
          <Text style={[styles.itemName, { color: colors.text }]}>
            {item.product?.name || "Produto"}
          </Text>
          <Text style={{ color: colors.secondary, fontSize: 14 }}>
            {item.quantity} unidade{item.quantity > 1 ? "s" : ""}
          </Text>
          <Text style={{ color: colors.text, fontWeight: "500", marginTop: 8 }}>
            R$ {item.product?.price?.toFixed(2) ?? "0,00"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removerItem(item.product_id)}
      >
        <Text style={styles.removeButtonText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Área de safe no topo */}
      <View style={{ height: insets.top }} />

      {/* Barra de Pesquisa */}
      <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
        <Feather name="search" size={20} color={colors.secondary} />
        <TextInput
          style={{ color: colors.secondary, marginLeft: 8, flex: 1 }}
          placeholder="Buscar produto..."
          placeholderTextColor={colors.secondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Lista de Itens */}
      {isLoading ? (
        <Text style={{ color: colors.text, textAlign: "center", marginTop: 20 }}>
          Carregando...
        </Text>
      ) : carrinho.length > 0 ? (
        <>
          <FlatList
            data={carrinho}
            keyExtractor={(item) => item.id} // Use o id único do purchase_products
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />

          {/* Total e Endereço */}
          <View style={styles.footer}>
            <Text style={[styles.totalText, { color: colors.text }]}>
              Total: R$ {total.toFixed(2)}
            </Text>

            <TouchableOpacity
              style={[styles.addressContainer, { backgroundColor: colors.card }]}
            >
              <Feather name="map-pin" size={20} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={[styles.addressText, { color: colors.text }]}>
                  Enviar para CSB 10 Conj...
                </Text>
              </View>
              <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                Alterar
              </Text>
            </TouchableOpacity>

            {/* Botão Comprar */}
            <TouchableOpacity style={styles.buyButton} onPress={comprar}>
              <Text style={styles.buyButtonText}>Comprar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text
          style={{
            color: colors.text,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Seu carrinho está vazio.
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logoContainer: {
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 16,
    fontWeight: "bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    backgroundColor: "#E0E0E0",
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "center",
  },
  removeButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  buyButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  menuText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    color: "#333",
  },
});
