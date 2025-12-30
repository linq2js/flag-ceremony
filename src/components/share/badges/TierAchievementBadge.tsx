/**
 * TierAchievementBadge - Medal with Bronze/Silver/Gold tier
 * Based on Image 2, Row 1, Col 3 (GOLD PATRIOT design)
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

const getTierInfo = (
  count: number
): { tier: string; emoji: string; color: string; bgColor: string } => {
  if (count >= 100)
    return { tier: "GOLD", emoji: "🥇", color: "#fbbf24", bgColor: "#78350f" };
  if (count >= 50)
    return { tier: "SILVER", emoji: "🥈", color: "#94a3b8", bgColor: "#334155" };
  if (count >= 10)
    return { tier: "BRONZE", emoji: "🥉", color: "#d97706", bgColor: "#78350f" };
  return { tier: "STARTER", emoji: "⭐", color: "#fbbf24", bgColor: "#78350f" };
};

export const TierAchievementBadge: React.FC<BadgeProps> = ({
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
  const tier = getTierInfo(stats?.completedCeremonies || 0);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LinearGradient
        colors={["#1f1f1f", "#171717", "#0a0a0a"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Ribbon at top */}
      <View style={[styles.ribbon, { height: 12 * scale }]}>
        <View style={[styles.ribbonRed, { height: 8 * scale }]} />
        <View style={[styles.ribbonGold, { height: 4 * scale }]} />
      </View>

      <View style={styles.content}>
        {/* Streak number in circle */}
        <View
          style={[
            styles.streakCircle,
            {
              width: 72 * scale,
              height: 72 * scale,
              borderRadius: 36 * scale,
              borderColor: tier.color,
            },
          ]}
        >
          <Text style={[styles.streakNumber, { fontSize: 32 * scale, color: tier.color }]}>
            {stats?.currentStreak || 0}
          </Text>
        </View>

        {/* Stars */}
        <View style={[styles.starsRow, { marginTop: 6 * scale }]}>
          <Text style={{ fontSize: 12 * scale }}>⭐</Text>
          <Text style={{ fontSize: 14 * scale }}>⭐</Text>
          <Text style={{ fontSize: 12 * scale }}>⭐</Text>
        </View>

        {/* Count box */}
        {showTotal && stats && (
          <View
            style={[
              styles.countBox,
              {
                backgroundColor: tier.color + "20",
                borderColor: tier.color,
                paddingHorizontal: 16 * scale,
                paddingVertical: 6 * scale,
                marginTop: 10 * scale,
              },
            ]}
          >
            <Text style={{ fontSize: 14 * scale }}>{tier.emoji}</Text>
            <Text
              style={[
                styles.countValue,
                { fontSize: 24 * scale, color: tier.color },
              ]}
            >
              {stats.completedCeremonies}
            </Text>
            <Text style={[styles.countLabel, { fontSize: 9 * scale }]}>
              {t("ceremonies").toUpperCase()}
            </Text>
          </View>
        )}

        {/* Stats rows */}
        <View style={[styles.statsGrid, { marginTop: 10 * scale }]}>
          {showCurrentStreak && stats && (
            <View style={styles.statRow}>
              <Text style={[styles.statIcon, { fontSize: 10 * scale }]}>🔥</Text>
              <Text style={[styles.statLabel, { fontSize: 9 * scale }]}>
                {t("day_streak")}:
              </Text>
              <Text style={[styles.statValue, { fontSize: 9 * scale }]}>
                {stats.currentStreak}
              </Text>
            </View>
          )}
          {showLongestStreak && stats && (
            <View style={styles.statRow}>
              <Text style={[styles.statIcon, { fontSize: 10 * scale }]}>⚡</Text>
              <Text style={[styles.statLabel, { fontSize: 9 * scale }]}>
                {t("best_streak")}:
              </Text>
              <Text style={[styles.statValue, { fontSize: 9 * scale }]}>
                {stats.longestStreak}
              </Text>
            </View>
          )}
        </View>

        {/* Tier badge */}
        <View
          style={[
            styles.tierBadge,
            {
              backgroundColor: tier.bgColor,
              paddingHorizontal: 14 * scale,
              paddingVertical: 4 * scale,
              marginTop: 10 * scale,
            },
          ]}
        >
          <Text style={[styles.tierText, { color: tier.color, fontSize: 10 * scale }]}>
            ─── {tier.tier} PATRIOT ───
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
  ribbon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  ribbonRed: {
    backgroundColor: "#dc2626",
    width: "100%",
  },
  ribbonGold: {
    backgroundColor: "#fbbf24",
    width: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  streakCircle: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
  streakNumber: {
    fontWeight: "800",
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  countBox: {
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
  },
  countValue: {
    fontWeight: "800",
  },
  countLabel: {
    color: "#ffffff",
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: -2,
  },
  statsGrid: {
    alignItems: "flex-start",
    gap: 4,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statIcon: {},
  statLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  statValue: {
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
  },
  tierBadge: {
    borderRadius: 20,
  },
  tierText: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

