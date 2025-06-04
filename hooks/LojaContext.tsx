import { useState, useEffect } from "react";
import { supabase, Store, UserProfile } from "../lib/supabase";

export function useStore() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterStoresByName = (name: string): Store[] => {
    return stores.filter((store) =>
      store.name?.toLowerCase().includes(name.toLowerCase())
    );
  };

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

      await fetchStores();
    } catch (error: any) {
      console.error("Erro ao criar loja:", error.message);
    }
  };

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

      await fetchStores();
    } catch (error: any) {
      console.error("Erro ao atualizar loja:", error.message);
    }
  };

  const deleteStore = async (id: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await fetchStores();
    } catch (error: any) {
      console.error("Erro ao excluir loja:", error.message);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return {
    stores,
    isLoading,
    fetchStores,
    filterStoresByName,
    createStore,
    updateStore,
    deleteStore,
  };
}