import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/AuthContext";
import DarkMode from "@/components/DarkMode";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";

function formatPhoneNumber(phone: string) {
  if (!phone) return "";
  const cleaned = phone.toString().replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `+55 (${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export default function ContaVendedor() {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível sair da conta.");
      console.log(error);
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
          <FontAwesome name="user" size={48} color={colors.text} />
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

      <View style={[styles.optionsContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.option}>
          <Feather name="map-pin" size={20} color={colors.text} />
          <Text style={[styles.optionText, { color: colors.text }]}>
            Meu Endereço
          </Text>
          <Feather name="chevron-right" size={20} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Feather name="dollar-sign" size={20} color={colors.text} />
          <Text style={[styles.optionText, { color: colors.text }]}>
            Carteira
          </Text>
          <Feather name="chevron-right" size={20} color={colors.text} />
        </TouchableOpacity>

        <Link href="/criarProduto" asChild>
          <TouchableOpacity style={styles.option}>
            <MaterialCommunityIcons
              name="inbox-outline"
              size={22}
              color={colors.text}
            />
            <Text style={[styles.optionText, { color: colors.text }]}>
              Meus Produtos
            </Text>
            <Feather name="chevron-right" size={20} color={colors.text} />
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={[styles.option, { borderBottomWidth: 0 }]}>
          <MaterialCommunityIcons
            name="text-box-check-outline"
            size={22}
            color={colors.text}
          />
          <Text style={[styles.optionText, { color: colors.text }]}>
            Meus pedidos
          </Text>
          <Feather name="chevron-right" size={20} color={colors.text} />
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
    borderRadius: 14,
    paddingVertical: 8,
    marginBottom: 24,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  optionText: {
    fontSize: 16,
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
});
