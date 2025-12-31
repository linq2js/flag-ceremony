import { Stack } from "expo-router";
import { View, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Suspense, useEffect, useState } from "react";
import { StoreProvider, useStore, mixins } from "storion/react";
import { app, nicknameMixin } from "../src/stores";
import { ServiceLoader } from "../src/components/ServiceLoader";
import { OfflineBanner } from "../src/components/OfflineBanner";
import { NicknameModal } from "../src/components/NicknameModal";
import "../global.css";

/**
 * Inner layout component that uses stores (must be inside StoreProvider)
 */
function AppContent() {
  const { nickname } = useStore(mixins({ nickname: nicknameMixin }));
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  // Show nickname modal on first launch if no nickname
  useEffect(() => {
    // Delay to ensure stores are loaded
    const timer = setTimeout(() => {
      if (!nickname) {
        setShowNicknameModal(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [nickname]);

  return (
    <View style={styles.container}>
      {/* Offline banner - shows when network is unavailable */}
      <OfflineBanner />
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

      {/* Nickname modal - required on first launch */}
      <NicknameModal
        visible={showNicknameModal}
        required={true}
        onSave={() => setShowNicknameModal(false)}
      />
    </View>
  );
}

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
      <AppContent />
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
