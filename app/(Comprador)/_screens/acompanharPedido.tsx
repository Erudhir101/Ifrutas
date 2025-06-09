import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useRouter, useLocalSearchParams } from "expo-router";
import { markPurchaseAsDelivered } from "@/lib/purchase";

const steps = [
  "Realizando pedido",
  "Pagamento concluído",
  "Recebido pelo entregador",
  "O entregador está indo até você!",
  "Encomenda entregue",
];

export default function AcompanharPedido() {
  const { id } = useLocalSearchParams(); // Captura o ID da compra
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const currentStep = 3; // índice do passo atual (0-based)
  const trackStepIndex = steps.indexOf("O entregador está indo até você!");

  const handleReceberPedido = async () => {
    if (!id) return;
    try {
      await markPurchaseAsDelivered(String(id));
      router.push("/(Comprador)/_screens/recebimentoPedido");
    } catch (error) {
      alert("Erro ao confirmar recebimento do pedido.");
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + 16,
          paddingTop: insets.top,
        },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Acompanhamento
        </Text>

        <View style={styles.statusContainer}>
          <Text style={[styles.subTitle, { color: colors.text }]}>
            Concluído!
          </Text>
          <Text style={[styles.message, { color: colors.secondary }]}>
            Recebemos seu pagamento, agora é só esperar a entrega.
          </Text>
        </View>

        <Text style={[styles.trackLabel, { color: colors.text }]}>
          Acompanhe o seu pedido:
        </Text>

        <View style={styles.stepsContainer}>
          {steps.map((label, idx) => {
            const done = idx <= currentStep;
            return (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepIndicator}>
                  <View
                    style={[
                      styles.circle,
                      done
                        ? { backgroundColor: colors.primary }
                        : { borderColor: colors.secondary, borderWidth: 2 },
                    ]}
                  />
                  {idx < steps.length - 1 && (
                    <View
                      style={[
                        styles.line,
                        done
                          ? { backgroundColor: colors.primary }
                          : { backgroundColor: colors.secondary },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.stepLabelContainer}>
                  <Text
                    style={[
                      styles.stepLabel,
                      done
                        ? { color: colors.text }
                        : { color: colors.secondary },
                    ]}
                  >
                    {label}
                  </Text>
                  {label === "O entregador está indo até você!" && (
                    <TouchableOpacity
                      style={[
                        styles.trackButton,
                        {
                          borderColor:
                            currentStep >= trackStepIndex
                              ? colors.primary
                              : colors.secondary,
                          backgroundColor:
                            currentStep >= trackStepIndex
                              ? "transparent"
                              : "#f0f0f0",
                        },
                      ]}
                      onPress={() => {
                        if (currentStep >= trackStepIndex) {
                          router.push(
                            "/(Comprador)/_screens/trackingEntregador",
                          ); // Atualize o caminho da rota
                        }
                      }}
                      disabled={currentStep < trackStepIndex}
                    >
                      <Text
                        style={[
                          styles.trackButtonText,
                          {
                            color:
                              currentStep >= trackStepIndex
                                ? colors.primary
                                : colors.secondary,
                          },
                        ]}
                      >
                        acompanhe o entregador
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.button, { borderColor: colors.primary }]}
          onPress={handleReceberPedido}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Recebi meu pedido
          </Text>
        </TouchableOpacity>

        <Text style={[styles.codeLabel, { color: colors.secondary }]}>
          Código do pedido
        </Text>
        <Text style={[styles.code, { color: colors.primary }]}>
          {id} {/* Exibe o ID da compra */}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  statusContainer: {
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  trackLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  stepsContainer: {
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stepIndicator: {
    width: 24,
    alignItems: "center",
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    flex: 1,
    width: 2,
    marginTop: 2,
  },
  stepLabelContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  stepLabel: {
    fontSize: 14,
  },
  trackButton: {
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  trackButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  codeLabel: {
    fontSize: 12,
  },
  code: {
    fontSize: 16,
    marginTop: 4,
    textDecorationLine: "underline",
  },
});
