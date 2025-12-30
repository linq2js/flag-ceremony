/**
 * MedalCleanBadge - Minimal medal badge design
 * Based on Image 2, Row 1, Col 2 (LIAM design with gold medal icon)
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const MedalCleanBadge: React.FC<BadgeProps> = ({
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
        colors={["#7f1d1d", "#5c1515", "#450a0a"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.content}>
        {/* Medal icon above photo */}
        <View
          style={[
            styles.medalIcon,
            {
              width: 40 * scale,
              height: 40 * scale,
              borderRadius: 20 * scale,
            },
          ]}
        >
          <Text style={{ fontSize: 20 * scale }}>🏅</Text>
        </View>

        {/* Photo */}
        <View
          style={[
            styles.photoContainer,
            {
              width: 64 * scale,
              height: 64 * scale,
              borderRadius: 32 * scale,
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

        {/* Large count */}
        {stats && (
          <View style={[styles.countSection, { marginTop: 6 * scale }]}>
            <Text style={[styles.count, { fontSize: 56 * scale, lineHeight: 64 * scale }]}>
              {stats.completedCeremonies}
            </Text>
            <Text style={[styles.countLabel, { fontSize: 12 * scale }]}>
              {t("ceremonies")}
            </Text>
          </View>
        )}

        {/* Stats */}
        {stats && (
          <View style={[styles.statsContainer, { marginTop: 8 * scale }]}>
            <Text style={[styles.statText, { fontSize: 9 * scale }]}>
              🔥 {t("current_streak")}: {stats.currentStreak}
            </Text>
            <Text style={[styles.statText, { fontSize: 9 * scale }]}>
              ⚡ {t("best_streak")}: {stats.longestStreak}
            </Text>
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
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  medalIcon: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  photoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
    textAlign: "center",
    lineHeight: 32,
    paddingHorizontal: 10,
    paddingBottom: 4,
  },
  countSection: {
    alignItems: "center",
  },
  count: {
    color: "#ffffff",
    fontWeight: "800",
  },
  countLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
    marginTop: 4,
  },
  statsContainer: {
    alignItems: "center",
    gap: 2,
  },
  statText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "700",
    letterSpacing: 2,
  },
});
