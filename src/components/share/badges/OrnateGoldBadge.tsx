/**
 * OrnateGoldBadge - Decorative gold border card
 * Based on Image 1, Row 3, Col 1-2 (ornate border cards)
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const OrnateGoldBadge: React.FC<BadgeProps> = ({
  photoUri,
  displayName,
  stats,
  showTotal,
  showCurrentStreak,
  showLongestStreak,
  t,
  scale = 1,
}) => {
  const size = 300 * scale;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LinearGradient
        colors={["#2a0a0a", "#1a0606", "#0f0303"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Ornate border */}
      <View
        style={[
          styles.border,
          {
            margin: 10 * scale,
            borderWidth: 2 * scale,
            borderRadius: 8 * scale,
          },
        ]}
      >
        {/* Corner decorations */}
        <View style={[styles.cornerTL, { top: 4, left: 4 }]}>
          <Text style={{ fontSize: 12 * scale }}>✦</Text>
        </View>
        <View style={[styles.cornerTR, { top: 4, right: 4 }]}>
          <Text style={{ fontSize: 12 * scale }}>✦</Text>
        </View>
        <View style={[styles.cornerBL, { bottom: 4, left: 4 }]}>
          <Text style={{ fontSize: 12 * scale }}>✦</Text>
        </View>
        <View style={[styles.cornerBR, { bottom: 4, right: 4 }]}>
          <Text style={{ fontSize: 12 * scale }}>✦</Text>
        </View>

        <View style={styles.content}>
          {/* Photo */}
          <View
            style={[
              styles.photoContainer,
              {
                width: 60 * scale,
                height: 60 * scale,
                borderRadius: 30 * scale,
              },
            ]}
          >
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={[
                  styles.photo,
                  {
                    width: 54 * scale,
                    height: 54 * scale,
                    borderRadius: 27 * scale,
                  },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.photoPlaceholder,
                  {
                    width: 54 * scale,
                    height: 54 * scale,
                    borderRadius: 27 * scale,
                  },
                ]}
              >
                <Text style={[styles.initial, { fontSize: 22 * scale }]}>
                  {displayName.charAt(0).toUpperCase() || "A"}
                </Text>
              </View>
            )}
          </View>

          {/* Name */}
          <Text
            style={[
              styles.name,
              { fontSize: 12 * scale, marginTop: 8 * scale },
            ]}
            numberOfLines={1}
          >
            {displayName || t("dedicated_patriot")}
          </Text>

          {/* Stats grid */}
          <View style={[styles.statsGrid, { marginTop: 10 * scale }]}>
            {showTotal && stats && (
              <View style={styles.statBox}>
                <Text style={{ fontSize: 12 * scale }}>🏆</Text>
                <Text style={[styles.statLabel, { fontSize: 8 * scale }]}>
                  {t("ceremonies").toUpperCase()}
                </Text>
                <Text style={[styles.statValue, { fontSize: 14 * scale }]}>
                  {stats.completedCeremonies}
                </Text>
              </View>
            )}
            {showCurrentStreak && stats && (
              <View style={styles.statBox}>
                <Text style={{ fontSize: 12 * scale }}>🔥</Text>
                <Text style={[styles.statLabel, { fontSize: 8 * scale }]}>
                  C Thays
                </Text>
                <Text style={[styles.statValue, { fontSize: 14 * scale }]}>
                  {stats.currentStreak}
                </Text>
              </View>
            )}
            {showLongestStreak && stats && (
              <View style={styles.statBox}>
                <Text style={{ fontSize: 12 * scale }}>⚡</Text>
                <Text style={[styles.statLabel, { fontSize: 8 * scale }]}>
                  X {t("days")}
                </Text>
                <Text style={[styles.statValue, { fontSize: 14 * scale }]}>
                  {stats.longestStreak}
                </Text>
              </View>
            )}
          </View>

          {/* Description line */}
          <Text
            style={[
              styles.description,
              { fontSize: 8 * scale, marginTop: 10 * scale },
            ]}
          >
            M1 Flag ceremony text
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 16,
  },
  border: {
    flex: 1,
    borderColor: "#fbbf24",
  },
  cornerTL: {
    position: "absolute",
  },
  cornerTR: {
    position: "absolute",
  },
  cornerBL: {
    position: "absolute",
  },
  cornerBR: {
    position: "absolute",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  photoContainer: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fbbf24",
  },
  photo: {
    resizeMode: "cover",
  },
  photoPlaceholder: {
    backgroundColor: "rgba(251, 191, 36, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: "#fbbf24",
    fontWeight: "700",
  },
  name: {
    color: "#ffffff",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    alignItems: "center",
    gap: 2,
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  statValue: {
    color: "#fbbf24",
    fontWeight: "700",
  },
  description: {
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "500",
  },
});

