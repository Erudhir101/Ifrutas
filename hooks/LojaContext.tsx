import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, Store, UserProfile } from "../lib/supabase";

interface StoreContextType {
  stores: Store[]; // Lista de lojas
  isLoading: boolean; // Indica se os dados estão sendo carregados
  fetchStores: () => Promise<void>; // Função para buscar lojas
  filterStoresByName: (name: string) => Store[]; // Filtrar lojas por nome
  createStore: (store: Omit<Store, "id">) => Promise<void>; // Criar loja
  updateStore: (id: string, updates: Partial<Store>) => Promise<void>; // Atualizar loja
  deleteStore: (id: string) => Promise<void>; // Excluir loja
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore deve ser usado dentro de um StoreProvider");
  }
  return context;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para buscar todas as lojas
  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_type", "vendedor");

      if (error) throw error;

      const fetchedStores = data.map((profile: UserProfile) => ({
        id: profile.id,
        name: profile.full_name,
        avatar_url: profile.avatar_url,
        endereco: profile.endereco,
        telefone: profile.telefone,
      }));

      setStores(fetchedStores);
    } catch (error: any) {
      console.error("Erro ao buscar lojas:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para filtrar lojas por nome
  const filterStoresByName = (name: string): Store[] => {
    return stores.filter((store) =>
      store.name.toLowerCase().includes(name.toLowerCase())
    );
  };

  // Função para criar uma nova loja
  const createStore = async (store: Omit<Store, "id">) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .insert({
          user_type: "vendedor",
          full_name: store.name,
          avatar_url: store.avatar_url,
          endereco: store.endereco,
          telefone: store.telefone,
        });

      if (error) throw error;

      await fetchStores(); // Atualiza a lista de lojas
    } catch (error: any) {
      console.error("Erro ao criar loja:", error.message);
    }
  };

  // Função para atualizar uma loja existente
  const updateStore = async (id: string, updates: Partial<Store>) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: updates.name,
          avatar_url: updates.avatar_url,
          endereco: updates.endereco,
          telefone: updates.telefone,
        })
        .eq("id", id);

      if (error) throw error;

      await fetchStores(); // Atualiza a lista de lojas
    } catch (error: any) {
      console.error("Erro ao atualizar loja:", error.message);
    }
  };

  // Função para excluir uma loja
  const deleteStore = async (id: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await fetchStores(); // Atualiza a lista de lojas
    } catch (error: any) {
      console.error("Erro ao excluir loja:", error.message);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const value = {
    stores,
    isLoading,
    fetchStores,
    filterStoresByName,
    createStore,
    updateStore,
    deleteStore,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}