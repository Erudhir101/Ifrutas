import { useState, useEffect } from "react";
import { supabase, Purchase, Product } from "../lib/supabase";
import { useAuth } from "./AuthContext";

let globalState: {
  purchases: Purchase[];
  isLoading: boolean;
  fetchPurchases: () => Promise<void>;
  fetchUserPurchases: () => Promise<void>;
  createPurchase: (
    storeId: string,
    products: { productId: string; quantity: number }[]
  ) => Promise<void>;
  updatePurchaseStatus: (
    purchaseId: string,
    isPaid?: boolean,
    isDelivered?: boolean
  ) => Promise<void>;
} | null = null;

export function usePurchase() {
  const { user } = useAuth();

  if (!globalState) {
    const purchases: Purchase[] = [];
    let isLoading = true;

    const fetchPurchases = async () => {
      isLoading = true;
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

        purchases.splice(0, purchases.length, ...formattedPurchases);
      } catch (error: any) {
        console.error("Erro ao buscar compras:", error.message);
      } finally {
        isLoading = false;
      }
    };

    const fetchUserPurchases = async () => {
      if (!user) return;
      isLoading = true;
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

        purchases.splice(0, purchases.length, ...formattedPurchases);
      } catch (error: any) {
        console.error("Erro ao buscar compras do usuário:", error.message);
      } finally {
        isLoading = false;
      }
    };

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

    globalState = {
      purchases,
      isLoading,
      fetchPurchases,
      fetchUserPurchases,
      createPurchase,
      updatePurchaseStatus,
    };

    // Carrega as compras do usuário na inicialização
    if (user) {
      fetchUserPurchases();
    }
  }

  return globalState;
}