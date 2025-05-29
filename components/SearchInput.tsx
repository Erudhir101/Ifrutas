import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

export default function SearchInput({
  setSearch,
  search,
}: {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  search: string;
}) {
  const { colors } = useTheme();

  const handleSearch = () => {
    Keyboard.dismiss();
    if (setSearch) {
      setSearch(search);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          shadowColor: colors.text,
          borderColor: colors.border,
        },
      ]}
    >
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder="Search..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
        clearButtonMode="while-editing"
      />
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <FontAwesome name="search" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

// Define the styles for the components
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#333",
    paddingRight: 10,
  },
  searchButton: {
    padding: 8,
  },
});
