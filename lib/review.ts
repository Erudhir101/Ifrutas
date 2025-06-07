import { Review, supabase } from "./supabase";
import { Alert } from "react-native";

export async function fetchAllReviews(): Promise<
  (Review & { author: { full_name: string } | null })[]
> {
  try {
    const { data, error } = await supabase.from("reviews").select(`
        *,
        author:profiles!reviews_user_id_fkey (
          full_name
        )
      `);
    if (error) {
      throw error;
    }
    if (error) {
      throw error;
    }

    return data as (Review & { author: { full_name: string } | null })[];
  } catch (error: any) {
    console.error("Erro ao buscar reviews:", error.message);
    return [];
  }
}

export async function fetchReviews(
  type: string,
  id: string,
): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select()
      .eq(type, id);

    if (error) {
      throw error;
    }
    return data as Review[];
  } catch (error: any) {
    console.error("Erro ao buscar reviews:", error.message);
    return [];
  }
}

export async function createReview(
  productData: Omit<Review, "id">,
): Promise<Review | null> {
  const { data: review, error: dbError } = await supabase
    .from("reviews")
    .insert({ ...productData })
    .select()
    .single();
  if (dbError) Alert.alert("Erro", `Falha ao criar Review: ${dbError.message}`);
  return review as Review;
}

export async function updateReview(
  reviewData: Omit<Review, "id">,
  item: Review,
): Promise<Review | null> {
  const { data: review, error: dbError } = await supabase
    .from("reviews")
    .update({ ...reviewData })
    .eq("id", item.id)
    .select()
    .single();
  if (dbError)
    Alert.alert("Erro", `Falha ao atualizar veiculo: ${dbError.message}`);
  return review as Review;
}

export async function deleteReview(review: Review) {
  const { error: dbError } = await supabase
    .from("reviews")
    .delete()
    .eq("id", review.id)
    .single();
  if (dbError) console.log("error ao deletar veiculo: ", dbError.message);
}
