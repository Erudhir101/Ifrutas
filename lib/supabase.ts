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

async function uploadImage(file, bucketName, path) {
  try {
    const { data: data, error: error } = await supabase.storage
      .from(bucketName)
      .upload(path, file);
    if (error) {
      throw error;
    }
    console.log("Imagem carregada com sucesso:", data);
    return data.path;
  } catch (error) {
    console.error("Erro ao carregar imagem:", error.message);
    return null;
  }
}

async function getPublicURL(bucketName, path) {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
}

export type Category =
  | "Frutas"
  | "Verduras"
  | "Legumes"
  | "Temperos"
  | "Graos"
  | "Organicos"
  | "Laticinios"
  | "Ovos"
  | "Ervas"
  | "Outros";

export type Measure =
  | "kilograma (kg)"
  | "grama (g)"
  | "unidade"
  | "cacho"
  | "maca"
  | "bandeja"
  | "duzia"
  | "pacote"
  | "litro (l)"
  | "mililitros (ml)";

export interface Product {
  name: string | null;
  description: string | null;
  price: number | null;
  amount: number | null;
  image: string | null;
  available: boolean | null;
  seller: string | null;
  created_at: string;
  updated_at: string;
  category: Category | null;
  measure: Measure | null;
}

export type User_type = "comprador" | "vendedor" | "entregador" | null;

export interface UserProfile {
  id: string;
  user_type: User_type;
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
      product: {
        Row: Product;
        Insert: Omit<Product, "id">;
        Update: Partial<Omit<Product, "id">>;
      };
    };
  };
}
