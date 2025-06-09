import React from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/AuthContext";
import DarkMode from "@/components/DarkMode";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTracking } from "@/hooks/RastreioContext";

function formatPhoneNumber(phone: string) {
  if (!phone) return "";
  const cleaned = phone.toString().replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `+55 (${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export default function ContaComprador() {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { getLastTrackingByUser } = useTracking();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <DarkMode />
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          {user?.avatar_url ? (
            <Image source={{ uri: user?.avatar_url }} style={styles.image} />
          ) : (
            <FontAwesome name="user" size={48} color={colors.text} />
          )}
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>
          {user?.full_name || "Nome Do Usuário"}
        </Text>
        <Text style={[styles.userPhone, { color: colors.text }]}>
          {formatPhoneNumber(user?.telefone || "61998756863")}
        </Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="file-text" size={24} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text }]}>
            Últimos Pedidos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="heart" size={24} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text }]}>
            Lojas Favoritas
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <Feather name="map-pin" size={20} color={"#000"} />
          <Text style={[styles.optionText]}>Meu Endereço</Text>
          <Feather name="chevron-right" size={20} color={"#000"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Feather name="dollar-sign" size={20} color={"#000"} />
          <Text style={[styles.optionText, { color: "#000" }]}>Carteira</Text>
          <Feather name="chevron-right" size={20} color={"#000"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={async () => {
            if (!user?.id) return;
            const tracking = await getLastTrackingByUser(user.id);
            if (tracking && tracking.id) {
              router.push({
                pathname: "/(Comprador)/_screens/ultimosPedidos",
                params: { id: tracking.id },
              });
            } else {
              Alert.alert(
                "Atenção",
                "Nenhum pedido encontrado para este usuário.",
              );
            }
          }}
        >
          <Feather name="shopping-cart" size={20} color={"#000"} />
          <Text style={[styles.optionText, { color: "#000" }]}>
            Meus Pedidos
          </Text>
          <Feather name="chevron-right" size={20} color={"#000"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Feather name="star" size={20} color={"#000"} />
          <Text style={[styles.optionText, { color: "#000" }]}>
            Meus Favoritos
          </Text>
          <Feather name="chevron-right" size={20} color={"#000"} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.signOutButton, { marginBottom: insets.bottom + 16 }]}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Sair</Text>
      </TouchableOpacity>
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
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logo: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userPhone: {
    fontSize: 14,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  actionButton: {
    alignItems: "center",
  },
  actionText: {
    fontSize: 12,
    marginTop: 8,
  },
  optionsContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 24,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  optionText: {
    fontSize: 16,
    color: "000",
  },
  signOutButton: {
    backgroundColor: "#FF4D4D",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  signOutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 1,
    objectFit: "cover",
    aspectRatio: 1,
  },
});
