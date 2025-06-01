import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export default function TrackingEntregador() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Mapa de Rastreamento
      </Text>
      <View style={styles.mapContainer}>
        {/* Mapa de exemplo (mockup) */}
      </View>
      <Text style={[styles.infoText, { color: colors.textSecondary }]}>
        Esta é uma tela de exemplo com um mapa.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mapContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  infoText: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
  },
});