/**
 * SimpleOliveBadge - Military olive tone card
 * Based on Image 2, Row 1, Col 4 (JOHNATHAN design)
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const SimpleOliveBadge: React.FC<BadgeProps> = ({
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
        colors={["#4d4d33", "#3d3d29", "#2d2d1f"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View
        style={[
          styles.content,
          {
            paddingTop: 16 * scale,
            paddingBottom: 16 * scale,
            paddingHorizontal: 20 * scale,
          },
        ]}
      >
        {/* Header with VN FLAG CEREMONY */}
        <View
          style={[styles.header, { marginBottom: 8 * scale, paddingBottom: 6 * scale }]}
        >
          <Text style={[styles.headerText, { fontSize: 10 * scale }]}>
            🇻🇳 {t("badge_flag_ceremony")} 🇻🇳
          </Text>
        </View>

        {/* Stars */}
        <View style={styles.starsRow}>
          <Text style={{ fontSize: 12 * scale }}>⭐</Text>
          <Text style={{ fontSize: 14 * scale }}>⭐</Text>
          <Text style={{ fontSize: 12 * scale }}>⭐</Text>
        </View>

        {/* Photo */}
        <View
          style={[
            styles.photoContainer,
            {
              width: 64 * scale,
              height: 64 * scale,
              borderRadius: 32 * scale,
              marginTop: 10 * scale,
            },
          ]}
        >
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={[
                styles.photo,
                {
                  width: 58 * scale,
                  height: 58 * scale,
                  borderRadius: 29 * scale,
                },
              ]}
            />
          ) : (
            <View
              style={[
                styles.photoPlaceholder,
                {
                  width: 58 * scale,
                  height: 58 * scale,
                  borderRadius: 29 * scale,
                },
              ]}
            >
              <Text style={[styles.initial, { fontSize: 24 * scale }]}>
                {displayName.charAt(0).toUpperCase() || "A"}
              </Text>
            </View>
          )}
        </View>

        {/* Name */}
        <Text
          style={[styles.name, { fontSize: 14 * scale, marginTop: 8 * scale }]}
          numberOfLines={1}
        >
          {displayName || t("dedicated_patriot")}
        </Text>

        {/* Description */}
        <Text style={[styles.description, { fontSize: 9 * scale }]}>
          This commemorates that
        </Text>

        {/* Stats */}
        {stats && (
          <View style={[styles.statsContainer, { marginTop: 10 * scale }]}>
            <View style={styles.statRow}>
              <Text style={{ fontSize: 10 * scale }}>🔥</Text>
              <Text style={[styles.statText, { fontSize: 10 * scale }]}>
                {t("current_streak")}: {stats.currentStreak} {t("days")}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={{ fontSize: 10 * scale }}>⚡</Text>
              <Text style={[styles.statText, { fontSize: 10 * scale }]}>
                {t("longest_streak")}: {stats.longestStreak} {t("days")}
              </Text>
            </View>
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
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(251, 191, 36, 0.3)",
  },
  headerText: {
    color: "#fbbf24",
    fontWeight: "700",
    letterSpacing: 2,
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
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
    color: "#fafaf9",
    fontWeight: "700",
    textTransform: "uppercase",
    textAlign: "center",
    lineHeight: 32,
    paddingHorizontal: 10,
    paddingBottom: 4,
  },
  description: {
    color: "rgba(250, 250, 249, 0.6)",
    fontStyle: "italic",
    marginTop: 4,
  },
  statsContainer: {
    alignItems: "flex-start",
    gap: 4,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    color: "rgba(250, 250, 249, 0.8)",
    fontWeight: "500",
  },
});
