import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, Purchase, Product, Store, UserProfile } from "../lib/supabase";
import { useAuth } from "./AuthContext";

interface PurchaseContextType {
  purchases: Purchase[]; // Lista de compras
  isLoading: boolean; // Indica se os dados estão sendo carregados
  fetchPurchases: () => Promise<void>; // Buscar todas as compras
  fetchUserPurchases: () => Promise<void>; // Buscar compras do usuário atual
  createPurchase: (
    storeId: string,
    products: { productId: string; quantity: number }[]
  ) => Promise<void>; // Criar compra
  updatePurchaseStatus: (
    purchaseId: string,
    isPaid?: boolean,
    isDelivered?: boolean
  ) => Promise<void>; // Atualizar status de compra
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export function usePurchase() {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error("usePurchase deve ser usado dentro de um PurchaseProvider");
  }
  return context;
}

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para buscar todas as compras
  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          store:store_id (*),
          products:purchase_products (product_id, quantity)
        `);

      if (error) throw error;

      const formattedPurchases = data.map((purchase: any) => ({
        ...purchase,
        store: {
          id: purchase.store.id,
          name: purchase.store.full_name,
          avatar_url: purchase.store.avatar_url,
          endereco: purchase.store.endereco,
          telefone: purchase.store.telefone,
        },
        products: purchase.products.map((p: any) => ({
          id: p.product_id,
          quantity: p.quantity,
        })),
      }));

      setPurchases(formattedPurchases);
    } catch (error: any) {
      console.error("Erro ao buscar compras:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para buscar compras do usuário atual
  const fetchUserPurchases = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          store:store_id (*),
          products:purchase_products (product_id, quantity)
        `)
        .eq("buyer_id", user.id);

      if (error) throw error;

      const formattedPurchases = data.map((purchase: any) => ({
        ...purchase,
        store: {
          id: purchase.store.id,
          name: purchase.store.full_name,
          avatar_url: purchase.store.avatar_url,
          endereco: purchase.store.endereco,
          telefone: purchase.store.telefone,
        },
        products: purchase.products.map((p: any) => ({
          id: p.product_id,
          quantity: p.quantity,
        })),
      }));

      setPurchases(formattedPurchases);
    } catch (error: any) {
      console.error("Erro ao buscar compras do usuário:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para criar uma nova compra
  const createPurchase = async (
    storeId: string,
    products: { productId: string; quantity: number }[]
  ) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("purchases")
        .insert([{ buyer_id: user.id, store_id: storeId }])
        .select("id")
        .single();

      if (error) throw error;

      const purchaseId = data.id;

      const productEntries = products.map((p) => ({
        purchase_id: purchaseId,
        product_id: p.productId,
        quantity: p.quantity,
      }));

      const { error: productError } = await supabase
        .from("purchase_products")
        .insert(productEntries);

      if (productError) throw productError;

      await fetchUserPurchases(); // Atualiza a lista de compras do usuário
    } catch (error: any) {
      console.error("Erro ao criar compra:", error.message);
    }
  };

  // Função para atualizar o status de uma compra
  const updatePurchaseStatus = async (
    purchaseId: string,
    isPaid?: boolean,
    isDelivered?: boolean
  ) => {
    try {
      const updates: Partial<Purchase> = {};
      if (isPaid !== undefined) updates.isPaid = isPaid;
      if (isDelivered !== undefined) updates.isDelivered = isDelivered;

      const { error } = await supabase
        .from("purchases")
        .update(updates)
        .eq("id", purchaseId);

      if (error) throw error;

      await fetchUserPurchases(); // Atualiza a lista de compras do usuário
    } catch (error: any) {
      console.error("Erro ao atualizar status da compra:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPurchases();
    }
  }, [user]);

  const value = {
    purchases,
    isLoading,
    fetchPurchases,
    fetchUserPurchases,
    createPurchase,
    updatePurchaseStatus,
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
}