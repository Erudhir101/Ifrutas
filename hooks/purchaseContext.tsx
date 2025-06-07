import { useState, useEffect } from "react";
import { supabase, Purchase, Product, Store, UserProfile } from "../lib/supabase";

export function usePurchases(userId?: string) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Busca todas as compras do usuário
  const fetchPurchases = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("purchases")
        .select("*, store:store_id(*), buyer:buyer_id(*), purchase_products:purchase_products(*, product:product_id(*))")
        .eq("buyer_id", userId);

      if (error) throw error;

      setPurchases(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar compras:", error.message);
      setPurchases([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Busca ou cria uma lista de compras aberta para o usuário e loja
  const getOrCreateOpenPurchase = async (storeId: string) => {
    if (!userId) return null;
    // Busca lista aberta (não paga e não entregue)
    let { data, error } = await supabase
      .from("purchases")
      .select("*, purchase_products:purchase_products(*, product:product_id(*))")
      .eq("buyer_id", userId)
      .eq("store_id", storeId)
      .eq("is_paid", false)
      .eq("is_delivered", false)
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      return data;
    } else {
      // Cria nova lista se não existir
      const { data: newPurchase, error: createError } = await supabase
        .from("purchases")
        .insert({
          buyer_id: userId,
          store_id: storeId,
          is_paid: false,
          is_delivered: false,
        })
        .select("*, purchase_products:purchase_products(*, product:product_id(*))")
        .single();

      if (createError) throw createError;
      return newPurchase;
    }
  };

  // Busca a última lista aberta (não paga) do usuário
  const getLastOpenPurchase = async () => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from("purchases")
      .select("*, purchase_products:purchase_products(*, product:product_id(*))")
      .eq("buyer_id", userId)
      .eq("is_paid", false)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  };

  // Retorna a quantidade total de itens na última lista aberta do usuário
  const getOpenPurchaseItemCount = async () => {
    const purchase = await getLastOpenPurchase();
    if (!purchase || !purchase.purchase_products) return 0;
    return purchase.purchase_products.reduce(
      (total: number, item: any) => total + (item.quantity || 0),
      0
    );
  };

  // Adiciona um item à lista de compras (purchase_products)
  const addItemToPurchase = async (
    purchaseId: string,
    product: Product,
    quantity: number = 1
  ) => {
    const { error } = await supabase.from("purchase_products").insert({
      purchase_id: purchaseId,
      product_id: product.id,
      quantity,
    });
    if (error) throw error;
    await fetchPurchases();
  };

  // Remove um item da lista de compras
  const removeItemFromPurchase = async (
    purchaseId: string,
    productId: string
  ) => {
    const { error } = await supabase
      .from("purchase_products")
      .delete()
      .eq("purchase_id", purchaseId)
      .eq("product_id", productId);
    if (error) throw error;
    await fetchPurchases();
  };

  // Limpa todos os itens da lista de compras (purchase_products)
  const clearPurchase = async (purchaseId: string) => {
    const { error } = await supabase
      .from("purchase_products")
      .delete()
      .eq("purchase_id", purchaseId);
    if (error) throw error;
    await fetchPurchases();
  };

  // Marca a lista como paga
  const markPurchaseAsPaid = async (purchaseId: string) => {
    const { error } = await supabase
      .from("purchases")
      .update({ is_paid: true })
      .eq("id", purchaseId);
    if (error) throw error;
    await fetchPurchases();
  };

  useEffect(() => {
    if (userId) fetchPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    purchases,
    isLoading,
    fetchPurchases,
    getOrCreateOpenPurchase,
    getLastOpenPurchase,
    addItemToPurchase,
    removeItemFromPurchase,
    clearPurchase,
    markPurchaseAsPaid,
    getOpenPurchaseItemCount,
  };
}