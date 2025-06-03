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
  id: string;
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

export interface Store {
  id: string; // ID do vendedor (UserProfile.id)
  name: string; // Nome completo do vendedor (UserProfile.full_name)
  avatar_url?: string; // Avatar do vendedor (UserProfile.avatar_url)
  endereco?: string; // Endereço do vendedor (UserProfile.endereco)
  telefone?: string; // Telefone do vendedor (UserProfile.telefone)
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

export interface Purchase {
  id: string; // ID único da compra
  products: Product[]; // Lista de produtos comprados
  store: Store; // Loja (vendedor) associada à compra
  buyer: UserProfile; // Comprador (UserProfile com user_type igual a "comprador")
  isPaid: boolean; // Indica se a compra foi paga
  isDelivered: boolean; // Indica se a compra foi entregue
  created_at: string; // Data de criação da compra
  updated_at: string; // Data de atualização da compra
}

export interface Tracking {
  id: string; // ID único do rastreio
  purchase_id: string; // ID da compra associada
  delivery_person_id: string; // ID do entregador (UserProfile.id)
  status: "pendente" | "em_transito" | "entregue" | "cancelada"; // Status do rastreio
  last_location: { latitude: number; longitude: number } | null; // Última localização do entregador
  estimated_time: string | null; // Tempo estimado para chegada (ISO 8601 duration format)
  created_at: string; // Data de criação do rastreio
  updated_at: string; // Data de atualização do rastreio
}

/*
Comandos SQL para criação das tabelas no banco de dados Supabase:

-- Tabela profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type TEXT CHECK (user_type IN ('comprador', 'vendedor', 'entregador')),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  endereco TEXT,
  telefone TEXT
);

-- Tabela product
CREATE TABLE IF NOT EXISTS product (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  amount NUMERIC,
  image TEXT,
  available BOOLEAN DEFAULT TRUE,
  seller UUID REFERENCES profiles (id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  category TEXT CHECK (category IN ('Frutas', 'Verduras', 'Legumes', 'Temperos', 'Graos', 'Organicos', 'Laticinios', 'Ovos', 'Ervas', 'Outros')),
  measure TEXT CHECK (measure IN ('kilograma (kg)', 'grama (g)', 'unidade', 'cacho', 'maca', 'bandeja', 'duzia', 'pacote', 'litro (l)', 'mililitros (ml)'))
);

-- Tabela purchases
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES profiles (id) ON DELETE CASCADE,
  store_id UUID REFERENCES profiles (id) ON DELETE CASCADE,
  is_paid BOOLEAN DEFAULT FALSE,
  is_delivered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela purchase_products (relaciona compras com produtos)
CREATE TABLE IF NOT EXISTS purchase_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES purchases (id) ON DELETE CASCADE,
  product_id bigint REFERENCES products (id) ON DELETE CASCADE,
  quantity INT NOT NULL
);

-- Tabela tracking
CREATE TABLE IF NOT EXISTS tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES purchases (id) ON DELETE CASCADE,
  delivery_person_id UUID REFERENCES profiles (id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pendente', 'em_transito', 'entregue', 'cancelada')) DEFAULT 'pendente',
  last_location JSONB, -- Armazena latitude e longitude como JSON
  estimated_time INTERVAL, -- Tempo estimado para chegada
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
*/
