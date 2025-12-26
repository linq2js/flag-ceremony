import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BaDinhSquare } from "./BaDinhSquare";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ScreenBackgroundProps {
  children: React.ReactNode;
}

export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Base dark gradient */}
      <LinearGradient
        colors={["#1a0a0a", "#0d0505", "#050202"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Ba Dinh Square illustration */}
      <View style={styles.illustrationContainer}>
        <BaDinhSquare 
          width={SCREEN_WIDTH * 1.2} 
          height={SCREEN_HEIGHT * 0.5} 
          opacity={0.25}
        />
      </View>

      {/* Gradient overlay to blend */}
      <LinearGradient
        colors={["transparent", "rgba(10,5,5,0.7)", "rgba(10,5,5,0.95)"]}
        locations={[0, 0.4, 0.8]}
        style={[StyleSheet.absoluteFill, { top: SCREEN_HEIGHT * 0.2 }]}
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
  illustrationContainer: {
    position: "absolute",
    top: 0,
    left: -SCREEN_WIDTH * 0.1,
    right: 0,
    opacity: 1,
    zIndex: 0,
  },
});
