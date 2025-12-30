/**
 * FireStreakBadge - Large streak with fire celebration
 * Based on Image 2, Row 3, Col 2 (OLIVIA 60 DAYS STREAK design)
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const FireStreakBadge: React.FC<BadgeProps> = ({
  photoUri,
  displayName,
  stats,
  showCurrentStreak,
  showLongestStreak,
  t,
  scale = 1,
}) => {
  const size = 300 * scale;

  // Fire emojis around photo
  const fireCount = 8;
  const firePositions = [...Array(fireCount)].map((_, i) => {
    const angle = (i * (360 / fireCount) * Math.PI) / 180 - Math.PI / 2;
    const radius = 50 * scale;
    return {
      left: 50 * scale + Math.cos(angle) * radius - 10 * scale,
      top: 50 * scale + Math.sin(angle) * radius - 10 * scale,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LinearGradient
        colors={["#7f1d1d", "#5c1515", "#450a0a"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.content}>
        {/* Photo with fire ring */}
        <View
          style={[
            styles.photoSection,
            {
              width: 100 * scale,
              height: 100 * scale,
            },
          ]}
        >
          {/* Fire emojis */}
          {firePositions.map((pos, i) => (
            <Text
              key={i}
              style={[
                styles.fireEmoji,
                {
                  fontSize: 16 * scale,
                  position: "absolute",
                  left: pos.left,
                  top: pos.top,
                },
              ]}
            >
              🔥
            </Text>
          ))}
          
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
        </View>

        {/* Name */}
        <Text
          style={[styles.name, { fontSize: 14 * scale, marginTop: 6 * scale }]}
          numberOfLines={1}
        >
          {displayName || t("dedicated_patriot")}
        </Text>

        {/* Large streak with fire icons */}
        <View style={[styles.streakSection, { marginTop: 8 * scale }]}>
          <View style={styles.streakRow}>
            <Text style={{ fontSize: 24 * scale }}>🔥</Text>
            <Text style={[styles.streakValue, { fontSize: 52 * scale }]}>
              {stats?.currentStreak || 0}
            </Text>
            <Text style={{ fontSize: 24 * scale }}>🔥</Text>
          </View>
          <Text style={[styles.streakLabel, { fontSize: 13 * scale }]}>
            {t("days").toUpperCase()} STREAK!
          </Text>
        </View>

        {/* Secondary stats */}
        <View style={[styles.statsRow, { marginTop: 10 * scale }]}>
          {showCurrentStreak && stats && (
            <Text style={[styles.statText, { fontSize: 9 * scale }]}>
              🔥 {t("streak_count")}: {stats.currentStreak}
            </Text>
          )}
          {showLongestStreak && stats && (
            <Text style={[styles.statText, { fontSize: 9 * scale }]}>
              ⚡ {t("best_streak")}: {stats.longestStreak}
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={[styles.footer, { marginTop: "auto" }]}>
          <Text style={[styles.footerText, { fontSize: 10 * scale }]}>
            FLAG CEREMONY
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
  photoSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  fireEmoji: {},
  photoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#f97316",
  },
  photo: {
    resizeMode: "cover",
  },
  photoPlaceholder: {
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: "#ffffff",
    fontWeight: "700",
  },
  name: {
    color: "#ffffff",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  streakSection: {
    alignItems: "center",
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  streakValue: {
    color: "#f97316",
    fontWeight: "900",
  },
  streakLabel: {
    color: "#ffffff",
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: -8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
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

