import { useAuth } from "@/hooks/AuthContext";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function SignOut() {
  const { signInLoading, signOut } = useAuth();
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={async () => {
        await signOut();
        router.replace("/(auth)/login");
      }}
    >
      <Text>{signInLoading ? "saindo...." : "sair"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
