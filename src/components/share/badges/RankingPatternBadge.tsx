/**
 * RankingPatternBadge - Top ranking with pattern background
 * Based on Image 1, Row 3, Col 3 (maple leaf pattern ranking card)
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const RankingPatternBadge: React.FC<BadgeProps> = ({
  photoUri,
  displayName,
  stats,
  t,
  scale = 1,
}) => {
  const size = 300 * scale;

  // Generate pattern positions
  const patternPositions = [...Array(12)].map((_, i) => ({
    left: (i % 4) * 80 * scale + 20 * scale,
    top: Math.floor(i / 4) * 100 * scale + 20 * scale,
    rotation: (i * 30) % 360,
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LinearGradient
        colors={["#d4a574", "#c4956a", "#b08550"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Pattern overlay */}
      {patternPositions.map((pos, i) => (
        <Text
          key={i}
          style={[
            styles.patternLeaf,
            {
              fontSize: 24 * scale,
              position: "absolute",
              left: pos.left,
              top: pos.top,
              transform: [{ rotate: `${pos.rotation}deg` }],
            },
          ]}
        >
          🍁
        </Text>
      ))}

      <View style={styles.content}>
        {/* Photo */}
        <View
          style={[
            styles.photoContainer,
            {
              width: 70 * scale,
              height: 70 * scale,
              borderRadius: 35 * scale,
            },
          ]}
        >
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={[
                styles.photo,
                {
                  width: 64 * scale,
                  height: 64 * scale,
                  borderRadius: 32 * scale,
                },
              ]}
            />
          ) : (
            <View
              style={[
                styles.photoPlaceholder,
                {
                  width: 64 * scale,
                  height: 64 * scale,
                  borderRadius: 32 * scale,
                },
              ]}
            >
              <Text style={[styles.initial, { fontSize: 26 * scale }]}>
                {displayName.charAt(0).toUpperCase() || "A"}
              </Text>
            </View>
          )}
        </View>

        {/* Top Ranking */}
        <View style={[styles.rankingSection, { marginTop: 12 * scale }]}>
          <Text style={[styles.topText, { fontSize: 14 * scale }]}>
            {t("badge_top")}
          </Text>
          <Text style={[styles.rankingValue, { fontSize: 48 * scale }]}>
            {stats?.percentile ? Math.ceil(100 - stats.percentile) : "XX"}
          </Text>
        </View>

        {/* RANKING label */}
        <View
          style={[
            styles.rankingLabel,
            {
              paddingHorizontal: 16 * scale,
              paddingVertical: 4 * scale,
              marginTop: 6 * scale,
            },
          ]}
        >
          <Text style={[styles.rankingLabelText, { fontSize: 11 * scale }]}>
            {t("badge_ranking")}
          </Text>
        </View>

        {/* Stars */}
        <View style={[styles.starsRow, { marginTop: 8 * scale }]}>
          <Text style={{ fontSize: 14 * scale }}>⭐</Text>
          <Text style={{ fontSize: 16 * scale }}>⭐</Text>
          <Text style={{ fontSize: 14 * scale }}>⭐</Text>
        </View>

        {/* Ceremonies count */}
        {stats && (
          <Text style={[styles.ceremoniesText, { fontSize: 10 * scale }]}>
            {stats.completedCeremonies} {t("ceremonies")}
          </Text>
        )}

        {/* Footer */}
        <Text style={[styles.footer, { fontSize: 9 * scale }]}>
          {t("badge_flag_ceremony")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 16,
  },
  patternLeaf: {
    opacity: 0.15,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  photoContainer: {
    backgroundColor: "#1c1917",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#1c1917",
  },
  photo: {
    resizeMode: "cover",
  },
  photoPlaceholder: {
    backgroundColor: "#292524",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: "#fbbf24",
    fontWeight: "700",
  },
  rankingSection: {
    alignItems: "center",
  },
  topText: {
    color: "#1c1917",
    fontWeight: "600",
  },
  rankingValue: {
    color: "#fbbf24",
    fontWeight: "900",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  rankingLabel: {
    backgroundColor: "#1c1917",
    borderRadius: 4,
  },
  rankingLabelText: {
    color: "#fbbf24",
    fontWeight: "700",
    letterSpacing: 2,
  },
  starsRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  ceremoniesText: {
    color: "#44403c",
    fontWeight: "600",
    marginTop: 6,
  },
  footer: {
    color: "rgba(68, 64, 60, 0.7)",
    fontWeight: "500",
    marginTop: "auto",
  },
});
