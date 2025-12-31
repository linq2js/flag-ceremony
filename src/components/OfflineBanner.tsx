/**
 * OfflineBanner - Shows a banner when the device is offline.
 *
 * Uses networkStore from storion/network to track connectivity.
 * Displays at the top of the screen with an animated entrance/exit.
 */

import React from "react";
import { View, Text, StyleSheet, Animated, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore, mixins } from "storion/react";
import { tMixin, onlineMixin } from "../stores";
import { palette } from "../design/colors";
import { spacing } from "../design/spacing";

export const OfflineBanner: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { online, t } = useStore(
    mixins({
      online: onlineMixin,
      t: tMixin,
    })
  );

  // Animated value for slide in/out
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: online ? -100 : 0,
      useNativeDriver: Platform.OS !== "web", // Native driver not supported on web
      tension: 100,
      friction: 12,
    }).start();
  }, [online, slideAnim]);

  // Don't render anything if online (but keep animation running)
  // This prevents layout shifts
  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[2],
          transform: [{ translateY: slideAnim }],
          pointerEvents: online ? "none" : "auto",
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📡</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{t("offline_title")}</Text>
          <Text style={styles.message}>{t("offline_message")}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: palette.orange[500],
    paddingBottom: spacing[3],
    paddingHorizontal: spacing[4],
    ...Platform.select({
      web: {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  iconContainer: {
    marginRight: spacing[3],
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
  title: {
    color: palette.dark.base,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  message: {
    color: "rgba(26, 6, 6, 0.8)",
    fontSize: 10,
    fontWeight: "500",
    lineHeight: 14,
  },
});
