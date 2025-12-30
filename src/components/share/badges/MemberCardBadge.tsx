/**
 * MemberCardBadge - Horizontal member info card
 * Based on Image 2, Row 2, Col 4 (OLIVID member card)
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const MemberCardBadge: React.FC<BadgeProps> = ({
  photoUri,
  displayName,
  stats,
  t,
  scale = 1,
}) => {
  const width = 340 * scale;
  const height = 212 * scale;

  const formatDate = (date?: Date) => {
    if (!date) return "2023";
    return new Date(date).getFullYear().toString();
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <LinearGradient
        colors={["#4d4d33", "#3d3d29", "#2d2d1f"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative border */}
      <View
        style={[
          styles.border,
          { margin: 8 * scale, borderWidth: 1 * scale, borderRadius: 8 * scale },
        ]}
      >
        <View style={styles.content}>
          {/* Left section */}
          <View style={[styles.leftSection, { width: "40%" }]}>
            {/* Photo */}
            <View
              style={[
                styles.photoContainer,
                {
                  width: 56 * scale,
                  height: 56 * scale,
                  borderRadius: 28 * scale,
                },
              ]}
            >
              {photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  style={[
                    styles.photo,
                    {
                      width: 50 * scale,
                      height: 50 * scale,
                      borderRadius: 25 * scale,
                    },
                  ]}
                />
              ) : (
                <View
                  style={[
                    styles.photoPlaceholder,
                    {
                      width: 50 * scale,
                      height: 50 * scale,
                      borderRadius: 25 * scale,
                    },
                  ]}
                >
                  <Text style={[styles.initial, { fontSize: 20 * scale }]}>
                    {displayName.charAt(0).toUpperCase() || "A"}
                  </Text>
                </View>
              )}
            </View>

            {/* Name and member since */}
            <Text
              style={[styles.name, { fontSize: 12 * scale, marginTop: 6 * scale }]}
              numberOfLines={1}
            >
              {displayName || t("dedicated_patriot")}
            </Text>
            <Text style={[styles.memberSince, { fontSize: 8 * scale }]}>
              Member since: {formatDate(stats?.memberSince)}
            </Text>

            {/* Secondary name/handle */}
            <Text style={[styles.handle, { fontSize: 10 * scale }]}>
              {displayName ? displayName.toUpperCase() : "PATRIOT"}
            </Text>
          </View>

          {/* Right section - Stats */}
          {stats && (
            <View style={styles.rightSection}>
              <View style={styles.statRow}>
                <Text style={{ fontSize: 10 * scale }}>🔥</Text>
                <Text style={[styles.statLabel, { fontSize: 9 * scale }]}>
                  {t("current_streak")}:
                </Text>
                <Text style={[styles.statValue, { fontSize: 10 * scale }]}>
                  {stats.currentStreak} {t("days")}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={{ fontSize: 10 * scale }}>⚡</Text>
                <Text style={[styles.statLabel, { fontSize: 9 * scale }]}>
                  {t("best_streak")}:
                </Text>
                <Text style={[styles.statValue, { fontSize: 10 * scale }]}>
                  {stats.longestStreak}
                </Text>
              </View>
              {stats?.percentile && (
                <View
                  style={[
                    styles.rankingBadge,
                    {
                      paddingHorizontal: 10 * scale,
                      paddingVertical: 4 * scale,
                      marginTop: 6 * scale,
                    },
                  ]}
                >
                  <Text style={[styles.rankingText, { fontSize: 9 * scale }]}>
                    {t("badge_top")} {Math.ceil(100 - stats.percentile)}%
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 12,
  },
  border: {
    flex: 1,
    borderColor: "rgba(251, 191, 36, 0.4)",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    padding: 12,
  },
  leftSection: {
    alignItems: "center",
    justifyContent: "center",
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
  },
  memberSince: {
    color: "rgba(250, 250, 249, 0.5)",
    fontWeight: "500",
    marginTop: 2,
  },
  handle: {
    color: "#fbbf24",
    fontWeight: "600",
    marginTop: 4,
  },
  rightSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 16,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  statLabel: {
    color: "rgba(250, 250, 249, 0.6)",
    fontWeight: "500",
  },
  statValue: {
    color: "#fafaf9",
    fontWeight: "600",
  },
  rankingBadge: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fbbf24",
  },
  rankingText: {
    color: "#fbbf24",
    fontWeight: "700",
  },
});
