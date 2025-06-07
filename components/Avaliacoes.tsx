import { supabase, UserProfile } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface Review {
  id: string;
  user_id: string;
  prof_id: string;
  review: string;
  stars: number;
}

export default function Avaliacoes({ user }: { user: UserProfile | null }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  async function fetchReview() {
    const { data: rev, error } = await supabase
      .from("reviews")
      .select()
      .eq("prof_id", user?.id);
    if (error) throw error;
    console.log(rev);
    setReviews(rev);
  }
  useEffect(() => {
    fetchReview();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avaliações</Text>
      {/* <Text style={styles.title}>{reviews[0].review}</Text> */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.review}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", paddingHorizontal: 15, gap: 15 },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
});
