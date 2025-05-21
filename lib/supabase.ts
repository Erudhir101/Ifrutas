import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_API_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_API_ANONKEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // lock: processLock,
  },
});

export interface UserProfile {
  id: string;
  user_type: "comprador" | "vendedor" | "entregador" | null;
  full_name: string;
  avatar_url?: string;
  endereco?: string;
  telefone?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "id">;
        Update: Partial<Omit<UserProfile, "id">>;
      };
    };
  };
}

// AppState.addEventListener("change", (state) => {
//   if (state === "active") {
//     supabase.auth.startAutoRefresh();
//   } else {
//     supabase.auth.stopAutoRefresh();
//   }
// });
