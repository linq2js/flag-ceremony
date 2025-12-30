/**
 * FireRingBadge - Flames surrounding photo
 * Based on Image 1, Row 1, Col 3 (Fire streak design)
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const FireRingBadge: React.FC<BadgeProps> = ({
  photoUri,
  displayName,
  stats,
  showTotal,
  t,
  scale = 1,
}) => {
  const size = 300 * scale;

  // Generate fire positions in a ring
  const firePositions = [...Array(14)].map((_, i) => {
    const angle = (i * 25.7 * Math.PI) / 180;
    const radius = 120 * scale;
    return {
      left: 150 * scale + Math.cos(angle) * radius - 14 * scale,
      top: 135 * scale + Math.sin(angle) * radius - 14 * scale,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LinearGradient
        colors={["#2a0a0a", "#1a0606", "#0f0303"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Fire ring */}
      {firePositions.map((pos, i) => (
        <Text
          key={i}
          style={[
            styles.fireEmoji,
            {
              fontSize: 22 * scale,
              position: "absolute",
              left: pos.left,
              top: pos.top,
            },
          ]}
        >
          🔥
        </Text>
      ))}

      <View style={styles.content}>
        {/* Photo with gold ring */}
        <View
          style={[
            styles.photoOuter,
            {
              width: 110 * scale,
              height: 110 * scale,
              borderRadius: 55 * scale,
            },
          ]}
        >
          <View
            style={[
              styles.photoContainer,
              {
                width: 100 * scale,
                height: 100 * scale,
                borderRadius: 50 * scale,
              },
            ]}
          >
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={[
                  styles.photo,
                  {
                    width: 92 * scale,
                    height: 92 * scale,
                    borderRadius: 46 * scale,
                  },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.photoPlaceholder,
                  {
                    width: 92 * scale,
                    height: 92 * scale,
                    borderRadius: 46 * scale,
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

        {/* Streak display */}
        <View style={[styles.streakSection, { marginTop: 12 * scale }]}>
          <Text style={[styles.streakValue, { fontSize: 48 * scale }]}>
            {stats?.currentStreak || 0}
          </Text>
          <Text style={[styles.streakLabel, { fontSize: 14 * scale }]}>
            {t("days").toUpperCase()} STREAK!
          </Text>
        </View>

        {/* Stars */}
        <View style={styles.starsRow}>
          <Text style={{ fontSize: 14 * scale }}>⭐</Text>
          <Text style={{ fontSize: 16 * scale }}>⭐</Text>
          <Text style={{ fontSize: 14 * scale }}>⭐</Text>
        </View>

        {/* Total ceremonies */}
        {showTotal && stats && (
          <Text style={[styles.totalText, { fontSize: 11 * scale }]}>
            {t("total")}: {stats.completedCeremonies} {t("ceremonies")}
          </Text>
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
  fireEmoji: {},
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  photoOuter: {
    backgroundColor: "rgba(251, 191, 36, 0.3)",
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
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: "#ffffff",
    fontWeight: "800",
  },
  streakSection: {
    alignItems: "center",
  },
  streakValue: {
    color: "#f97316",
    fontWeight: "900",
  },
  streakLabel: {
    color: "#ffffff",
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: -6,
  },
  starsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  totalText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
    marginTop: 8,
  },
});

