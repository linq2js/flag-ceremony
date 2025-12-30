/**
 * MilitaryStarsBadge - Stars header military style
 * Based on Image 2, Row 1, Col 4 variant with more military styling
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const MilitaryStarsBadge: React.FC<BadgeProps> = ({
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
        colors={["#3d3d29", "#2d2d1f", "#1d1d15"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative border */}
      <View
        style={[
          styles.border,
          { margin: 8 * scale, borderWidth: 2 * scale, borderRadius: 12 * scale },
        ]}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={[styles.header, { marginBottom: 6 * scale }]}>
            <Text style={{ fontSize: 10 * scale }}>🇻🇳</Text>
            <Text style={[styles.headerText, { fontSize: 9 * scale }]}>
              FLAG CEREMONY
            </Text>
            <Text style={{ fontSize: 10 * scale }}>🇻🇳</Text>
          </View>

          {/* Stars row */}
          <View style={styles.starsRow}>
            <Text style={{ fontSize: 14 * scale }}>⭐</Text>
            <Text style={{ fontSize: 16 * scale }}>⭐</Text>
            <Text style={{ fontSize: 14 * scale }}>⭐</Text>
          </View>

          {/* Photo */}
          <View
            style={[
              styles.photoContainer,
              {
                width: 60 * scale,
                height: 60 * scale,
                borderRadius: 30 * scale,
                marginTop: 8 * scale,
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
              { fontSize: 12 * scale, marginTop: 6 * scale },
            ]}
            numberOfLines={1}
          >
            {displayName || t("dedicated_patriot")}
          </Text>

          {/* Description */}
          <Text style={[styles.description, { fontSize: 8 * scale }]}>
            This commemorates that
          </Text>

          {/* Stats */}
          {stats && (
            <View style={[styles.statsContainer, { marginTop: 8 * scale }]}>
              <View style={styles.statRow}>
                <Text style={{ fontSize: 10 * scale }}>🔥</Text>
                <Text style={[styles.statText, { fontSize: 9 * scale }]}>
                  {t("current_streak")}: {stats.currentStreak} {t("days")}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={{ fontSize: 10 * scale }}>⚡</Text>
                <Text style={[styles.statText, { fontSize: 9 * scale }]}>
                  {t("longest_streak")}: {stats.longestStreak} {t("days")}
                </Text>
              </View>
              {stats?.percentile && (
                <View style={styles.statRow}>
                  <Text style={{ fontSize: 10 * scale }}>👑</Text>
                  <Text style={[styles.statText, { fontSize: 9 * scale }]}>
                    Top {Math.ceil(100 - stats.percentile)}%
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Action button */}
          <View
            style={[
              styles.actionButton,
              {
                paddingHorizontal: 14 * scale,
                paddingVertical: 5 * scale,
                marginTop: 8 * scale,
              },
            ]}
          >
            <Text style={[styles.actionText, { fontSize: 8 * scale }]}>
              GO CEREMONY
            </Text>
          </View>
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
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerText: {
    color: "#fbbf24",
    fontWeight: "700",
    letterSpacing: 1,
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
  },
  description: {
    color: "rgba(250, 250, 249, 0.5)",
    fontStyle: "italic",
    marginTop: 2,
  },
  statsContainer: {
    alignItems: "flex-start",
    gap: 3,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statText: {
    color: "rgba(250, 250, 249, 0.8)",
    fontWeight: "500",
  },
  actionButton: {
    backgroundColor: "#fbbf24",
    borderRadius: 4,
  },
  actionText: {
    color: "#1c1917",
    fontWeight: "700",
    letterSpacing: 1,
  },
});
