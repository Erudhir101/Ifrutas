import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

type Coordinate = {
  latitude: number;
  longitude: number;
};

const coordinates: Coordinate[] = [
  {
    latitude: -15.7952,
    longitude: -47.8832,
  },
  {
    latitude: -15.6932,
    longitude: -47.8812,
  },
];

function calcularDistanciaHaversine(pos1: Coordinate, pos2: Coordinate) {
  const R = 6371; // Raio da Terra em quilômetros

  // Converter graus para radianos
  const paraRadianos = (grau: number) => grau * (Math.PI / 180);

  const phi1 = paraRadianos(pos1.latitude);
  const lambda1 = paraRadianos(pos1.longitude);
  const phi2 = paraRadianos(pos2.latitude);
  const lambda2 = paraRadianos(pos2.longitude);

  const deltaPhi = phi2 - phi1;
  const deltaLambda = lambda2 - lambda1;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distancia = R * c;
  return distancia; // Distância em quilômetros
}

export default function MapaEntregador() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            style={[styles.btn, styles.btnClose]}
          >
            <Feather color="#000" name="x" size={19} />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>Help</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={[styles.btn, styles.btnClose]}
            >
              <Feather color="#000" name="navigation" size={19} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -15.7942,
          longitude: -47.8822,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Origin */}
        <Marker coordinate={coordinates[0]}>
          <View style={styles.marker}>
            <FontAwesome name="shopping-basket" color="#fff" size={15} />
          </View>
        </Marker>

        {/* Destination */}
        <Marker coordinate={coordinates[coordinates.length - 1]}>
          <View style={styles.marker}>
            <FontAwesome name="home" color="#fff" size={15} />
          </View>
        </Marker>

        <Polyline
          coordinates={coordinates}
          strokeColor={colors.secondary}
          strokeWidth={3}
        />
      </MapView>

      <SafeAreaView style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Pedido está chegado</Text>

          <Text style={styles.sheetSubtitle}>
            Arrives in
            <Text style={{ fontWeight: "600", color: "#000" }}>
              {" " +
                calcularDistanciaHaversine(
                  coordinates[0],
                  coordinates[1],
                ).toFixed(2) +
                " km"}
            </Text>
          </Text>
        </View>

        <View style={styles.sheetSection}>
          <View style={{ marginRight: "auto" }}>
            <Text style={styles.sectionTitle}>Driver</Text>

            <Text style={styles.sectionSubtitle}>John D.</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <View style={styles.btnSm}>
              <Text style={styles.btnSmText}>Add tip</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.btnSm}
          >
            <Feather color="#000" name="phone" size={19} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.btnSm}
          >
            <Feather color="#000" name="send" size={19} />
          </TouchableOpacity>
        </View>

        <View style={styles.sheetSection}>
          <View style={{ marginRight: "auto" }}>
            <Text style={styles.sectionTitle}>Restaurant</Text>

            <Text style={styles.sectionSubtitle}>
              Old Fashion Burger Restaurant
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <View style={styles.btnSm}>
              <Text style={styles.btnSmText}>Add tip</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.btnSm}
          >
            <Feather color="#000" name="phone" size={19} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionFooter}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <View style={styles.btnPrimary}>
              <Text style={styles.btnPrimaryText}>Detalhes do Pedido</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <View style={styles.btnEmpty}>
              <Text style={styles.btnEmptyText}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  marker: {
    width: 30,
    height: 30,
    backgroundColor: "#000",
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  /** Header */
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  headerActions: {
    alignItems: "flex-end",
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#efefef",
    borderColor: "#efefef",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  btnClose: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: 0.45,
  },
  btnSm: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#efefef",
    borderColor: "#efefef",
    marginLeft: 4,
  },
  btnSmText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: "#000",
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#F82E08",
    borderColor: "#F82E08",
  },
  btnPrimaryText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
    color: "#fff",
  },
  btnEmpty: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    marginTop: 4,
  },
  btnEmptyText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
    color: "#1D1D1D",
  },
  /** Sheet */
  sheet: {
    flex: 1,
    maxHeight: 372,
    marginTop: "auto",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#e8e8e8",
  },
  sheetTitle: {
    fontSize: 23,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6d6d6d",
  },
  sheetSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#e8e8e8",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1d1d1d",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6a6a6a",
  },
  sectionFooter: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
});
