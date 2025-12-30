import { Stack } from "expo-router";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import { StoreProvider } from "storion/react";
import { app } from "../src/stores";
import { ServiceLoader } from "../src/components/ServiceLoader";
import { palette } from "../src/design/colors";
import "../global.css";

export default function RootLayout() {
  return (
    <StoreProvider container={app}>
      <StatusBar style="light" />
      {/* ServiceLoader blocks initial render until persist tasks complete */}
      <Suspense
        fallback={
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={palette.orange[500]} />
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
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  sceneContainer: {
    backgroundColor: "#0a0a0a",
  },
});
