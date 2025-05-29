import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { router, type Href } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

interface NavigationButtonsProps {
  onNextPress?: () => void;
  onBackPress?: () => void;
  nextPage?: Href;
  showBackButton?: boolean;
  showNextButton?: boolean;
  nextButtonActivate?: boolean;
  nextButtonTitle?: string;
  backButtonTitle?: string;
}

export default function NavigationButtons({
  onNextPress,
  onBackPress,
  nextPage,
  showBackButton = true,
  showNextButton = true,
  nextButtonActivate = false,
  nextButtonTitle = "Prosseguir",
  backButtonTitle = "Retornar",
}: NavigationButtonsProps) {
  const handleNext = () => {
    if (onNextPress) {
      onNextPress();
    } else if (nextPage) {
      router.push(nextPage);
    } else {
      console.warn(
        "Nenhuma ação definida para o botão Próximo. Forneça 'onNextPress' ou 'nextPage'.",
      );
    }
  };

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            padding: 14,
            borderRadius: 4,
          }}
          onPress={handleBack}
        >
          <Text style={[{ color: colors.background, fontWeight: "bold" }]}>
            {backButtonTitle}
          </Text>
        </TouchableOpacity>
      )}
      {showNextButton && (
        <TouchableOpacity
          disabled={!nextButtonActivate}
          style={{
            backgroundColor: colors.primary,
            padding: 14,
            borderRadius: 4,
          }}
          onPress={handleNext}
        >
          <Text
            style={[
              { color: colors.background, opacity: 0.5, fontWeight: "bold" },
              nextButtonActivate && { opacity: 1 },
            ]}
          >
            {nextButtonTitle}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    bottom: 5,
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  text: {
    fontWeight: "bold",
  },
});
