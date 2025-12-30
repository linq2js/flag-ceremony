/**
 * SimpleOrangeBadge - Warm orange minimalist card
 * Based on Image 2, Row 1, Col 1 (ANNA design)
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const SimpleOrangeBadge: React.FC<BadgeProps> = ({
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
        colors={["#fef3c7", "#fcd34d", "#f59e0b"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View
        style={[
          styles.content,
          {
            paddingTop: 24 * scale,
            paddingBottom: 16 * scale,
            paddingHorizontal: 20 * scale,
          },
        ]}
      >
        {/* Photo */}
        <View
          style={[
            styles.photoContainer,
            {
              width: 64 * scale,
              height: 64 * scale,
              borderRadius: 32 * scale,
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
          style={[styles.name, { fontSize: 16 * scale, marginTop: 10 * scale }]}
          numberOfLines={1}
        >
          {displayName || t("dedicated_patriot")}
        </Text>

        {/* Large count */}
        {stats && (
          <View style={[styles.countSection, { marginTop: 8 * scale }]}>
            <Text
              style={[
                styles.count,
                { fontSize: 64 * scale, lineHeight: 70 * scale },
              ]}
            >
              {stats.completedCeremonies}
            </Text>
            <Text
              style={[
                styles.countLabel,
                { fontSize: 12 * scale, marginTop: -8 * scale },
              ]}
            >
              {t("ceremonies")}
            </Text>
          </View>
        )}

        {/* Stats row */}
        {stats && (
          <View style={[styles.statsRow, { marginTop: 12 * scale }]}>
            <View style={styles.statItem}>
              <Text style={{ fontSize: 10 * scale }}>🔥</Text>
              <Text style={[styles.statText, { fontSize: 10 * scale }]}>
                {t("current_streak")}: {stats.currentStreak}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={{ fontSize: 10 * scale }}>⚡</Text>
              <Text style={[styles.statText, { fontSize: 10 * scale }]}>
                {t("best_streak")}: {stats.longestStreak}
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={[styles.footer, { marginTop: "auto" }]}>
          <Text style={[styles.footerText, { fontSize: 10 * scale }]}>
            {t("badge_flag_ceremony")}
          </Text>
          <Text style={{ fontSize: 12 * scale }}>🇻🇳</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  photoContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  photo: {
    resizeMode: "cover",
  },
  photoPlaceholder: {
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: "#78350f",
    fontWeight: "700",
  },
  name: {
    color: "#1c1917",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  countSection: {
    alignItems: "center",
  },
  count: {
    color: "#1c1917",
    fontWeight: "800",
  },
  countLabel: {
    color: "#57534e",
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    color: "#44403c",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    color: "#78350f",
    fontWeight: "700",
    letterSpacing: 2,
  },
});
