import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useTheme } from "../hooks/useTheme";
import { useNavigation, Link } from "expo-router";
import { Button } from "@react-navigation/elements";

export default function Auth() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <Text style={{ color: colors.text, fontSize: 18 }}>Faça seu Login</Text>
        <View style={[styles.label]}>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
            placeholderTextColor={colors.text}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Email"
            autoCapitalize={"none"}
          />
        </View>
        <View style={[styles.label]}>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
            placeholderTextColor={colors.text}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Senha"
            autoCapitalize={"none"}
          />
        </View>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
        <Link href="/two">Go to Details</Link>
      </View>

      <View style={[styles.buttons]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          disabled={loading}
          onPress={() => signInWithEmail()}
        >
          <Text style={styles.textButton}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          disabled={loading}
          onPress={() => signUpWithEmail()}
        >
          <Text style={styles.textButton}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: "black",
  },
  labels: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    width: "100%",
  },
  label: {
    gap: 4,
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  buttons: {
    gap: 16,
    width: "70%",
    borderRadius: 12,
  },
  button: {
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 16,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mt20: {
    marginTop: 20,
  },
});
