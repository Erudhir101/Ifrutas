import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const homeComprador = () => {
  return (
    <SafeAreaView style={style.container}>
      <Text>comprador</Text>
    </SafeAreaView>
  );
};

export default homeComprador;

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
