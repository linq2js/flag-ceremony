/**
 * TrophyBannerBadge - Flag banner with trophy icon
 * Based on Image 1, Row 2, Col 1
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { BadgeProps } from "./types";

export const TrophyBannerBadge: React.FC<BadgeProps> = ({
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
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Banner at top */}
      <View style={[styles.banner, { height: 36 * scale }]}>
        <Svg width={size} height={36 * scale} viewBox="0 0 300 36">
          <Path
            d="M20 0 L280 0 L280 28 L290 28 L280 36 L270 28 L30 28 L20 36 L10 28 L20 28 Z"
            fill="#dc2626"
          />
          <Path d="M25 3 L275 3 L275 25 L25 25 Z" fill="none" stroke="#fbbf24" strokeWidth="1" />
        </Svg>
        <Text style={[styles.bannerText, { fontSize: 12 * scale }]}>
          FLAG CEREMONY
        </Text>
      </View>

      <View style={styles.content}>
        {/* Trophy icon */}
        <Text style={{ fontSize: 32 * scale, marginTop: 6 * scale }}>🏆</Text>

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

        {/* Count */}
        {stats && (
          <View style={[styles.countSection, { marginTop: 10 * scale }]}>
            <Text style={[styles.count, { fontSize: 42 * scale }]}>
              {stats.completedCeremonies}
            </Text>
            <Text style={[styles.countLabel, { fontSize: 11 * scale }]}>
              {t("ceremonies").toUpperCase()}
            </Text>
          </View>
        )}

        {/* Stats */}
        {stats && (
          <View style={[styles.statsRow, { marginTop: 12 * scale }]}>
            <Text style={[styles.statText, { fontSize: 10 * scale }]}>
              {stats.currentStreak} {t("days")}
            </Text>
            <Text style={[styles.divider, { fontSize: 10 * scale }]}> | </Text>
            <Text style={[styles.statText, { fontSize: 10 * scale }]}>
              {stats.longestStreak}X {t("days")}
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
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerText: {
    position: "absolute",
    color: "#fbbf24",
    fontWeight: "800",
    letterSpacing: 2,
    top: 8,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  photoContainer: {
    backgroundColor: "#fbbf24",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fbbf24",
  },
  photo: {
    resizeMode: "cover",
  },
  photoPlaceholder: {
    backgroundColor: "#92400e",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: "#fef3c7",
    fontWeight: "700",
  },
  countSection: {
    alignItems: "center",
  },
  count: {
    color: "#fbbf24",
    fontWeight: "800",
  },
  countLabel: {
    color: "#ffffff",
    fontWeight: "600",
    letterSpacing: 2,
    marginTop: -4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  divider: {
    color: "rgba(255, 255, 255, 0.4)",
  },
});
