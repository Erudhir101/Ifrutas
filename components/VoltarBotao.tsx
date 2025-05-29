import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

export default function VoltarBotao() {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <Text>
        <AntDesign name="leftcircleo" size={50} color={colors.text} />
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
