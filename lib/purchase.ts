import { supabase } from "./supabase";

export interface Purchase {
  id: string;
  purchase_id: string;
  product_id: string;
  quantity: string;
}

export async function createPurchase(
  buyerId: string,
  storeId: string,
  purchases: Partial<Purchase>[],
) {
  if (!storeId || !purchases || !buyerId) return;

  const { data, error } = await supabase
    .from("purchases")
    .insert([
      {
        buyer_id: buyerId,
        store_id: storeId,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  purchases.forEach((p) => ({
    purchase_id: data.id,
  }));

  const { error: productError } = await supabase
    .from("purchase_products")
    .insert(purchases);

  if (productError) throw productError;
}

export async function updatePurchase() {}

export async function deletePurchase() {}

export async function fetchPurchases(purchasesId: string): Promise<Purchase[]> {
  const { data: purchases, error } = await supabase
    .from("purchase_products")
    .select()
    .eq("purchase_id", purchasesId);
  if (error) throw error;
  return purchases;
}

export async function markPurchaseAsDelivered(purchaseId: string) {
  const { error } = await supabase
    .from("purchases")
    .update({ is_delivered: true })
    .eq("id", purchaseId);
  if (error) throw error;
}
