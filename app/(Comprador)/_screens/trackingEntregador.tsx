import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps'; // Importando o mapa
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/AuthContext";
import { useTracking } from "@/hooks/RastreioContext";
import { Feather } from "@expo/vector-icons";

export interface Tracking {
  id: string; // ID único do rastreio
  purchase_id: string; // ID da compra associada
  delivery_person_id: string; // ID do entregador (UserProfile.id)
  status: "pendente" | "em_transito" | "entregue" | "cancelada"; // Status do rastreio
  last_location: { latitude: number; longitude: number } | null; // Última localização do entregador
  estimated_time: string | null; // Tempo estimado para chegada (ISO 8601 duration format)
  updated_at: string; // Data de atualização do rastreio
}

export default function TrackingEntregador() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets(); // <-- adicionado
  const router = useRouter();
  const { user } = useAuth();
  const { getLastTrackingByUser } = useTracking();

  // Exemplo de dados de rastreio
  const trackingData: Tracking = {
    id: "12345",
    purchase_id: "67890",
    delivery_person_id: "54321",
    status: "em_transito",
    last_location: { latitude: -15.7942, longitude: -47.8822 },
    estimated_time: "PT30M", // 30 minutos no formato ISO 8601
    updated_at: "2025-06-02T12:00:00Z",
  };

  // Função para formatar o status
  const formatStatus = (status: string) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "em_transito":
        return "Em Trânsito";
      case "entregue":
        return "Entregue";
      case "cancelada":
        return "Cancelada";
      default:
        return "Desconhecido";
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Área de safe no topo */}
      <View style={{ height: insets.top }} />

      {/* Botão de voltar */}
      <TouchableOpacity
        style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}
        onPress={async () => {
          if (!user?.id) return;
          const tracking = await getLastTrackingByUser(user.id);
          if (tracking && tracking.id) {
            router.push({
              pathname: "/(Comprador)/_screens/acompanharPedido",
              params: { id: tracking.id },
            });
          }
        }}
      >
        <Feather name="arrow-left" size={28} color={colors.text} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>
        Rastreamento do Pedido
      </Text>
      <View style={styles.mapContainer}>
        {trackingData.last_location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: trackingData.last_location.latitude,
              longitude: trackingData.last_location.longitude,
              latitudeDelta: 0.01, // Zoom do mapa
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: trackingData.last_location.latitude,
                longitude: trackingData.last_location.longitude,
              }}
              title="Localização do Entregador"
              description="Última localização conhecida"
            />
          </MapView>
        ) : (
          <Text style={[styles.infoText, { color: colors.text }]}>
            Localização não disponível
          </Text>
        )}
      </View>
      <View style={styles.trackingCard}>
        <Text style={[styles.status, { color: colors.primary }]}>
          Status: {formatStatus(trackingData.status)}
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          Tempo Estimado: {trackingData.estimated_time || "Não disponível"}
        </Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Última Atualização: {new Date(trackingData.updated_at).toLocaleString()}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  trackingCard: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});