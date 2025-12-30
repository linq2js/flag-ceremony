/**
 * SilhouetteBadge - Ba Dinh Square silhouette design
 * Based on Image 1, Row 1, Col 4
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Rect } from "react-native-svg";
import { BadgeProps } from "./types";

export const SilhouetteBadge: React.FC<BadgeProps> = ({
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
        colors={["#1a1a1a", "#0f0f0f", "#050505"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Ba Dinh silhouette at bottom */}
      <View style={[styles.silhouette, { bottom: 0, height: 80 * scale }]}>
        <Svg width={size} height={80 * scale} viewBox="0 0 300 80">
          {/* Mausoleum */}
          <Rect x="100" y="30" width="100" height="50" fill="#2d1f1f" />
          <Path d="M90 30 L150 10 L210 30 Z" fill="#2d1f1f" />
          {/* Columns */}
          <Rect x="110" y="35" width="8" height="40" fill="#1a1212" />
          <Rect x="130" y="35" width="8" height="40" fill="#1a1212" />
          <Rect x="150" y="35" width="8" height="40" fill="#1a1212" />
          <Rect x="170" y="35" width="8" height="40" fill="#1a1212" />
          <Rect x="182" y="35" width="8" height="40" fill="#1a1212" />
          {/* Side buildings */}
          <Rect x="20" y="50" width="60" height="30" fill="#1a1212" />
          <Rect x="220" y="50" width="60" height="30" fill="#1a1212" />
        </Svg>
      </View>

      <View style={styles.content}>
        {/* Photo with gold ring */}
        <View
          style={[
            styles.photoContainer,
            {
              width: 80 * scale,
              height: 80 * scale,
              borderRadius: 40 * scale,
            },
          ]}
        >
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={[
                styles.photo,
                {
                  width: 72 * scale,
                  height: 72 * scale,
                  borderRadius: 36 * scale,
                },
              ]}
            />
          ) : (
            <View
              style={[
                styles.photoPlaceholder,
                {
                  width: 72 * scale,
                  height: 72 * scale,
                  borderRadius: 36 * scale,
                },
              ]}
            >
              <Text style={[styles.initial, { fontSize: 28 * scale }]}>
                {displayName.charAt(0).toUpperCase() || "A"}
              </Text>
            </View>
          )}
        </View>

        {/* Count */}
        {stats && (
          <View style={[styles.countSection, { marginTop: 10 * scale }]}>
            <Text style={[styles.count, { fontSize: 48 * scale }]}>
              {stats.completedCeremonies}
            </Text>
            <Text style={[styles.countLabel, { fontSize: 11 * scale }]}>
              {t("ceremonies")}
            </Text>
          </View>
        )}

        {/* Stats row */}
        {stats && (
          <View style={[styles.statsContainer, { marginTop: 10 * scale }]}>
            <Text style={[styles.statText, { fontSize: 10 * scale }]}>
              {t("current_streak")}: {stats.currentStreak} {t("days")}
            </Text>
            <Text style={[styles.divider, { fontSize: 10 * scale }]}> | </Text>
            <Text style={[styles.statText, { fontSize: 10 * scale }]}>
              {t("cool_streak")}: {stats.longestStreak} {t("days")}
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
  silhouette: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  photoContainer: {
    backgroundColor: "#fbbf24",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
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
    fontWeight: "800",
  },
  countSection: {
    alignItems: "center",
  },
  count: {
    color: "#fbbf24",
    fontWeight: "800",
  },
  countLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  statText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  divider: {
    color: "rgba(255, 255, 255, 0.4)",
  },
});
