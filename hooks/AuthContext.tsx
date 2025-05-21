import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase, UserProfile } from "../lib/supabase"; // Certifique-se que UserProfile vem de supabase.ts

export type UserType = UserProfile["user_type"];

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.details === "The result contains 0 rows") {
        console.warn(
          `Perfil não encontrado para o usuário ${userId}. Isso pode ser esperado após o cadastro inicial.`,
        );
        setUser(null);
      } else if (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userType: UserType,
    fullName: string,
    endereco: string,
    telefone: string,
  ) => {
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

      const { data: existingProfile, error: fetchProfileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (fetchProfileError) {
        console.error("Erro ao verificar perfil existente:", fetchProfileError);
        throw fetchProfileError;
      }

      if (existingProfile) {
        console.warn(
          `Perfil para o usuário ${userId} já existe. Ignorando a inserção.`,
        );
        const { error: updateProfileError } = await supabase
          .from("profiles")
          .update({
            user_type: userType,
            full_name: fullName,
            endereco: endereco,
            telefone: telefone,
          })
          .eq("id", userId)
          .single();

        if (updateProfileError) {
          console.warn(
            `Perfil para o usuário ${userId} não foi criado de forma correta`,
          );
        }
        return;
      } else {
        const { data: profileInsertData, error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            user_type: userType,
            full_name: fullName,
            endereco: endereco,
            telefone: telefone,
          })
          .single();

        if (profileError) {
          console.error("Erro ao criar perfil:", profileError);
          throw profileError;
        }

        if (profileInsertData) {
          setUser(profileInsertData);
        }
      }
    } catch (error: any) {
      console.error("Erro em signUp:", error.message);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error: error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Erro em signIn:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("Erro em signOut:", error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!session && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
