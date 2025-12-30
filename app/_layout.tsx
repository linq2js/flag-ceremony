import { Stack } from "expo-router";
import { View, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Suspense, useEffect } from "react";
import { StoreProvider } from "storion/react";
import { app } from "../src/stores";
import { ServiceLoader } from "../src/components/ServiceLoader";
import "../global.css";

export default function RootLayout() {
  // Hide splash screen when app is ready (web only)
  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      // Wait for React to render, then hide splash
      const timer = setTimeout(() => {
        if ((window as any).hideSplashScreen) {
          (window as any).hideSplashScreen();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <StoreProvider container={app}>
      <StatusBar style="light" />
      {/* ServiceLoader blocks initial render until persist tasks complete */}
      <Suspense
        fallback={
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        }
      >
        <ServiceLoader />
      </Suspense>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: styles.sceneContainer,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="share-badge"
          options={{
            presentation: "fullScreenModal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0a0000", // Match splash screen background
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  sceneContainer: {
    backgroundColor: "#0a0a0a",
  },
});
