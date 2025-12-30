import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ScreenBackgroundProps {
  children: React.ReactNode;
}

export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({
  children,
}) => {
  return (
    <View style={styles.container}>
      {/* Base dark gradient */}
      <LinearGradient
        colors={["#1a0a0a", "#0d0505", "#050202"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Gradient overlay */}
      <LinearGradient
        colors={[
          "rgba(10,5,5,0.3)",
          "rgba(10,5,5,0.7)",
          "rgba(10,5,5,0.95)",
          "#0a0505",
        ]}
        locations={[0, 0.15, 0.35, 0.5]}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050202",
  },
});
