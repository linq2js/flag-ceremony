/**
 * SimpleRedBadge - Clean red card with photo, name, stars, and stats
 * Based on Image 1, Row 1, Col 1
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const SimpleRedBadge: React.FC<BadgeProps> = ({
  photoUri,
  displayName,
  stats,
  t,
  scale = 1,
}) => {
  const size = 300 * scale;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LinearGradient
        colors={["#8b0000", "#5c0000", "#3d0000"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={[styles.content, { paddingHorizontal: 20 * scale }]}>
        {/* Photo */}
        <View
          style={[
            styles.photoRing,
            {
              width: 100 * scale,
              height: 100 * scale,
              borderRadius: 50 * scale,
            },
          ]}
        >
          <View
            style={[
              styles.photoContainer,
              {
                width: 90 * scale,
                height: 90 * scale,
                borderRadius: 45 * scale,
              },
            ]}
          >
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={[
                  styles.photo,
                  {
                    width: 86 * scale,
                    height: 86 * scale,
                    borderRadius: 43 * scale,
                  },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.photoPlaceholder,
                  {
                    width: 86 * scale,
                    height: 86 * scale,
                    borderRadius: 43 * scale,
                  },
                ]}
              >
                <Text style={[styles.initial, { fontSize: 36 * scale }]}>
                  {displayName.charAt(0).toUpperCase() || "A"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Name */}
        <Text
          style={[styles.name, { fontSize: 18 * scale, marginTop: 12 * scale }]}
          numberOfLines={1}
        >
          {displayName || t("dedicated_patriot")}
        </Text>

        {/* Stars row */}
        <View style={[styles.starsRow, { marginTop: 8 * scale }]}>
          <Text style={{ fontSize: 16 * scale }}>⭐</Text>
          <Text style={{ fontSize: 12 * scale }}>🇻🇳</Text>
          <Text style={{ fontSize: 16 * scale }}>⭐</Text>
        </View>

        {/* Stats */}
        {stats && (
          <View style={[styles.statsContainer, { marginTop: 16 * scale }]}>
            <Text style={[styles.statText, { fontSize: 11 * scale }]}>
              {t("current_streak")}: {stats.currentStreak} {t("days")}
            </Text>
            <Text style={[styles.divider, { fontSize: 11 * scale }]}> | </Text>
            <Text style={[styles.statText, { fontSize: 11 * scale }]}>
              {t("best_streak")}: {stats.longestStreak} {t("days")}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 16,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  photoRing: {
    backgroundColor: "rgba(255, 215, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  photoContainer: {
    backgroundColor: "#fbbf24",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    resizeMode: "cover",
  },
  photoPlaceholder: {
    backgroundColor: "#dc2626",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: "#ffffff",
    fontWeight: "800",
  },
  name: {
    color: "#ffffff",
    fontWeight: "700",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  statText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  divider: {
    color: "rgba(255, 255, 255, 0.5)",
  },
});
