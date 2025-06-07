import { useTheme } from "@/hooks/useTheme";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";

export default function Carousel({ pages }: { pages: string[] }) {
  const [page, setPage] = useState(0);
  const [showDots, setShowDots] = useState(true);
  const { colors } = useTheme();
  const pagerRef = useRef<PagerView>(null);

  // Autoplay: avança a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => {
        const nextPage = prev + 1 < pages.length ? prev + 1 : 0;
        pagerRef.current?.setPage(nextPage);
        return nextPage;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [pages.length]);

  useEffect(() => {
    const timer = setTimeout(() => setShowDots(false), 1000);
    return () => clearTimeout(timer);
  }, [page]);

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => {
          setPage(e.nativeEvent.position);
          setShowDots(true);
        }}
      >
        {pages.map((content, index) => (
          <View key={index} style={styles.page}>
            <Image style={styles.image} source={{ uri: content }} />
          </View>
        ))}
      </PagerView>

      {showDots && (
        <View style={styles.indicatorContainer}>
          {pages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                page === i
                  ? [styles.activeDot, { backgroundColor: colors.text }]
                  : [{ backgroundColor: colors.border }],
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: 200,
    borderWidth: 2,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    position: "absolute",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderColor: "#eee",
  },
});
