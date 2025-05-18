import React, { useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";
import { View, Text } from "react-native";
import { supabase } from "../../lib/supabase";
import { Session } from "@supabase/supabase-js";
import Auth from "@/components/Auth";

const LoginScreen = () => {
  const { colors } = useTheme();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Auth />
      {session && session.user && <Text>{session.user.id}</Text>}
    </View>
  );
};

export default LoginScreen;
