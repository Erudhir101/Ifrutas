import { useAuth } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "@/components/Carousel";
import SignOut from "@/components/SignOut";

const categories = ["Frutas", "Vegetais", "Orgânicos"];
export default function HomeComprador() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const pages = ["page1", "page2"];
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <SignOut />
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scroll}>
          <Text style={[styles.title, { color: colors.text }]}>
            Bem vindo(a){" "}
            {<Text style={{ color: colors.primary }}>{user?.full_name}</Text>}
          </Text>
          <Carousel pages={pages} />

          <View style={styles.categories}>
            {categories.map((item, key) => (
              <TouchableOpacity key={key} style={styles.categorie}>
                <Image />
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  scroll: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    gap: 40,
  },
  title: {
    width: "100%",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
  },
  categories: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 16,
  },
  categorie: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    paddingVertical: 30,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
