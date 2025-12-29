/**
 * Online Service - Network connectivity detection
 *
 * Provides platform-specific network status monitoring:
 * - Native (iOS/Android): Uses expo-network
 * - Web: Uses navigator.onLine and online/offline events
 */
import { Platform } from "react-native";
import { onlineService as defaultOnlineService } from "storion/network";
import { emitter, Resolver } from "storion";

export type OnlineService = ReturnType<typeof defaultOnlineService>;

// =============================================================================
// NATIVE IMPLEMENTATION
// =============================================================================

export function nativeOnlineService(): OnlineService {
  const onOnlineChange = emitter<boolean>();
  let online = true;

  // Dynamically import expo-network to avoid web bundling issues
  import("expo-network").then((Network) => {
    Network.getNetworkStateAsync().then((state) => {
      online = state.isConnected ?? true;
      onOnlineChange.emit(online);
    });
    Network.addNetworkStateListener((state) => {
      online = state.isConnected ?? true;
      onOnlineChange.emit(online);
    });
  });

  return {
    isOnline: () => online,

    subscribe: onOnlineChange.on,
  };
}

/**
 * Get the online service singleton.
 * Call `init()` once at app startup on native platforms.
 */
export function customOnlineService(resolver: Resolver): OnlineService {
  return Platform.OS === "web"
    ? defaultOnlineService(resolver)
    : nativeOnlineService();
}
