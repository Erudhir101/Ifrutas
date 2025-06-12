import { useTheme } from "@/hooks/useTheme";
import { fetchAllReviews } from "@/lib/review";
import { UserProfile } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

interface Review {
  id: string;
  user_id: string;
  prof_id: string;
  review: string;
  stars: number;
}

const { width } = Dimensions.get("window");

export default function Avaliacoes({ user }: { user: UserProfile | null }) {
  const [reviews, setReviews] = useState<
    (Review & { author: { full_name: string } | null })[]
  >([]);
  const { colors } = useTheme();

  const loadReviews = async () => {
    const fetched = await fetchAllReviews();
    setReviews(fetched);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avaliações</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {reviews.map((item, key) => (
          <View
            key={key}
            style={[styles.reviewCard, { borderColor: colors.border }]}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: colors.text,
                alignItems: "center",
              }}
            >
              {item.author?.full_name +
                "  " +
                "⭐⭐⭐⭐⭐".slice(0, item.stars)}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontWeight: "bold",
                fontStyle: "italic",
              }}
            >
              {item.review}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 15,
    gap: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  button: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 14,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  reviewCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
    padding: 15,
    gap: 10,
  },
});
