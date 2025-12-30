import { Stack } from "expo-router";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Suspense, useEffect } from "react";
import { StoreProvider } from "storion/react";
import { app } from "../src/stores";
import { ServiceLoader } from "../src/components/ServiceLoader";
import { palette } from "../src/design/colors";
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
            <View style={styles.splashContent}>
              <Image
                source={require("../assets/splash-icon.png")}
                style={styles.splashIcon}
                resizeMode="contain"
              />
              <ActivityIndicator
                size="large"
                color={palette.orange[500]}
                style={styles.loader}
              />
            </View>
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
    backgroundColor: "#DC2626", // Match splash screen background
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  splashContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  splashIcon: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  loader: {
    marginTop: 16,
  },
  sceneContainer: {
    backgroundColor: "#0a0a0a",
  },
});
