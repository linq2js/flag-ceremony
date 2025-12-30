/**
 * OrnateGreenBadge - Decorative military green card
 * Based on Image 1, Row 3, Col 1 (green ornate card)
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const OrnateGreenBadge: React.FC<BadgeProps> = ({
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
        colors={["#1a2e1a", "#0f1f0f", "#0a150a"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Ornate border */}
      <View
        style={[
          styles.border,
          {
            margin: 10 * scale,
            borderWidth: 2 * scale,
            borderRadius: 8 * scale,
          },
        ]}
      >
        {/* Corner decorations */}
        <View style={[styles.cornerTL, { top: 4, left: 4 }]}>
          <Text style={{ fontSize: 12 * scale, color: "#a3e635" }}>◆</Text>
        </View>
        <View style={[styles.cornerTR, { top: 4, right: 4 }]}>
          <Text style={{ fontSize: 12 * scale, color: "#a3e635" }}>◆</Text>
        </View>
        <View style={[styles.cornerBL, { bottom: 4, left: 4 }]}>
          <Text style={{ fontSize: 12 * scale, color: "#a3e635" }}>◆</Text>
        </View>
        <View style={[styles.cornerBR, { bottom: 4, right: 4 }]}>
          <Text style={{ fontSize: 12 * scale, color: "#a3e635" }}>◆</Text>
        </View>

        <View style={styles.content}>
          {/* Photo */}
          <View
            style={[
              styles.photoContainer,
              {
                width: 60 * scale,
                height: 60 * scale,
                borderRadius: 30 * scale,
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
              { fontSize: 12 * scale, marginTop: 8 * scale },
            ]}
            numberOfLines={1}
          >
            {displayName || t("dedicated_patriot")}
          </Text>

          {/* Flag icons */}
          <View style={styles.flagRow}>
            <Text style={{ fontSize: 10 * scale }}>🇻🇳</Text>
            <Text style={[styles.flagText, { fontSize: 8 * scale }]}>
              N Day...
            </Text>
          </View>

          {/* Stats grid */}
          <View style={[styles.statsGrid, { marginTop: 10 * scale }]}>
            {showTotal && stats && (
              <View style={styles.statBox}>
                <Text style={{ fontSize: 12 * scale }}>🏆</Text>
                <Text style={[styles.statLabel, { fontSize: 8 * scale }]}>
                  XX {t("ceremonies")}
                </Text>
              </View>
            )}
            {showCurrentStreak && stats && (
              <View style={styles.statBox}>
                <Text style={{ fontSize: 12 * scale }}>⚡</Text>
                <Text style={[styles.statLabel, { fontSize: 8 * scale }]}>
                  C Thays
                </Text>
              </View>
            )}
            {showLongestStreak && stats && (
              <View style={styles.statBox}>
                <Text style={{ fontSize: 12 * scale }}>⚡</Text>
                <Text style={[styles.statLabel, { fontSize: 8 * scale }]}>
                  X {t("days")}
                </Text>
              </View>
            )}
          </View>

          {/* Main stats display */}
          <View style={[styles.mainStats, { marginTop: 8 * scale }]}>
            <Text style={[styles.mainStatLabel, { fontSize: 9 * scale }]}>
              W Din in Days
            </Text>
            <Text style={[styles.mainStatValue, { fontSize: 16 * scale }]}>
              {stats?.completedCeremonies || 0}
            </Text>
          </View>

          {/* Description */}
          <Text style={[styles.description, { fontSize: 8 * scale }]}>
            M1 Flag ceremony text
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
  border: {
    flex: 1,
    borderColor: "#a3e635",
  },
  cornerTL: {
    position: "absolute",
  },
  cornerTR: {
    position: "absolute",
  },
  cornerBL: {
    position: "absolute",
  },
  cornerBR: {
    position: "absolute",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  photoContainer: {
    backgroundColor: "rgba(163, 230, 53, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#a3e635",
  },
  photo: {
    resizeMode: "cover",
  },
  photoPlaceholder: {
    backgroundColor: "rgba(163, 230, 53, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: "#a3e635",
    fontWeight: "700",
  },
  name: {
    color: "#ffffff",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  flagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  flagText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  statBox: {
    alignItems: "center",
    gap: 2,
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  mainStats: {
    alignItems: "center",
  },
  mainStatLabel: {
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "500",
  },
  mainStatValue: {
    color: "#a3e635",
    fontWeight: "700",
  },
  description: {
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: "500",
    marginTop: 6,
  },
});

