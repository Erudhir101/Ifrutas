import { Redirect } from "expo-router";
import { useAuth } from "../hooks/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Redirect to appropriate tab group based on user type
  switch (user?.user_type) {
    case "comprador":
      return <Redirect href="/(Comprador)/homeComprador" />;
    case "vendedor":
      return <Redirect href="/(Vendedor)/homeVendedor" />;
    case "entregador":
      return <Redirect href="/(Entregador)/homeEntregador" />;
    default:
      return <Redirect href="/(auth)/login" />;
  }
}
