/**
 * MedalRibbonBadge - Gold medal with decorative ribbon
 * Based on Image 1, Row 1, Col 2
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { BadgeProps } from "./types";

export const MedalRibbonBadge: React.FC<BadgeProps> = ({
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

      {/* Ribbon banner at top */}
      <View style={[styles.ribbon, { height: 24 * scale }]}>
        <Svg width={size} height={24 * scale} viewBox={`0 0 300 24`}>
          <Path d="M0 0 L300 0 L300 18 L150 24 L0 18 Z" fill="#dc2626" />
          <Path d="M0 18 L150 24 L300 18 L300 20 L150 26 L0 20 Z" fill="#fbbf24" />
        </Svg>
      </View>

      {/* Medal circle background */}
      <View style={[styles.medalContainer, { top: 36 * scale }]}>
        <Svg width={140 * scale} height={140 * scale} viewBox="0 0 140 140">
          <Defs>
            <RadialGradient id="medalGrad" cx="50%" cy="30%" r="70%">
              <Stop offset="0%" stopColor="#fcd34d" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#b45309" stopOpacity="0.2" />
            </RadialGradient>
          </Defs>
          <Circle cx="70" cy="70" r="68" fill="url(#medalGrad)" />
          <Circle cx="70" cy="70" r="68" fill="none" stroke="#fbbf24" strokeWidth="3" />
        </Svg>
      </View>

      <View style={styles.content}>
        {/* Photo in medal center */}
        <View
          style={[
            styles.photoContainer,
            {
              width: 80 * scale,
              height: 80 * scale,
              borderRadius: 40 * scale,
              marginTop: 50 * scale,
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
        {showTotal && stats && (
          <View style={[styles.countSection, { marginTop: 16 * scale }]}>
            <Text style={[styles.count, { fontSize: 42 * scale }]}>
              {stats.completedCeremonies}
            </Text>
            <Text style={[styles.countLabel, { fontSize: 11 * scale }]}>
              {t("ceremonies").toUpperCase()}
            </Text>
          </View>
        )}

        {/* Stats with fire icons */}
        <View style={[styles.statsRow, { marginTop: 12 * scale }]}>
          {showCurrentStreak && stats && (
            <View style={styles.statItem}>
              <Text style={{ fontSize: 12 * scale }}>🔥</Text>
              <Text style={[styles.statText, { fontSize: 11 * scale }]}>
                {stats.currentStreak} {t("days")}
              </Text>
            </View>
          )}
          {showLongestStreak && stats && (
            <View style={styles.statItem}>
              <Text style={{ fontSize: 12 * scale }}>⚡</Text>
              <Text style={[styles.statText, { fontSize: 11 * scale }]}>
                {stats.longestStreak} {t("days")}
              </Text>
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
    borderRadius: 16,
  },
  ribbon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  medalContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
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
    color: "#ffffff",
    fontWeight: "600",
    letterSpacing: 2,
    marginTop: -4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
});

