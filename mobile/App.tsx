import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import SpatialScene from "./src/ar/SpatialScene";

export default function App() {
  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        initialScene={{ scene: SpatialScene }}
        style={styles.ar}
      />

      <SafeAreaView pointerEvents="none" style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>WL02 — Spatial AR</Text>
          <Text style={styles.text}>
            Mova o celular para detectar uma mesa ou piso. Toque no plano para posicionar o cubo. Depois arraste, gire ou use pinch para alterar a escala.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  ar: { flex: 1 },
  overlay: { position: "absolute", left: 0, right: 0, top: 0 },
  card: {
    margin: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.64)",
  },
  title: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  text: { color: "#FFFFFF", marginTop: 4, fontSize: 14, lineHeight: 20 },
});
