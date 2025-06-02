import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase, UserProfile } from "../lib/supabase";
import { router } from "expo-router"; // Import router here

export type UserType = UserProfile["user_type"];

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signInLoading: boolean;
  signUp: (
    email: string,
    password: string,
    userType: UserType,
    fullName: string,
    endereco: string,
    telefone: string,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [signInLoading, setSignInLoading] = useState(false);

  useEffect(() => {
    const getAndSetProfile = async (userId: string) => {
      try {
        const { data, error, status } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // 1. Check for existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await getAndSetProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // 2. Set up listener for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await getAndSetProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      switch (user.user_type) {
        case "comprador":
          router.replace("/(Comprador)/homeComprador");
          break;
        case "vendedor":
          router.replace("/(Vendedor)/homeVendedor");
          break;
        case "entregador":
          router.replace("/(Entregador)/homeEntregador");
          break;
      }
    } else if (!isLoading && !user && router.canGoBack()) {
      router.replace("/");
    }
  }, [user, isLoading]);

  const signUp = async (
    email: string,
    password: string,
    userType: UserType,
    fullName: string,
    endereco: string,
    telefone: string,
  ) => {
    setSignInLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        throw authError;
      }

      const userId = authData.user?.id;
      if (!userId) {
        throw new Error("ID do usuário não encontrado após o registro.");
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          user_type: userType,
          full_name: fullName,
          endereco: endereco,
          telefone: telefone,
        })
        .eq("id", userId);

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
        throw profileError;
      }
    } catch (error: any) {
      console.error("Erro em signUp:", error.message);
      throw error;
    } finally {
      setSignInLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setSignInLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Erro em signIn:", error);
      throw error;
    } finally {
      setSignInLoading(false);
    }
  };

  const signOut = async () => {
    setSignInLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("Erro em signOut:", error);
      throw error;
    } finally {
      setSignInLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signInLoading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!session && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
