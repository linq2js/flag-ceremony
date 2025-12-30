/**
 * PatriotIDBadge - ID card style certificate
 * Based on Image 1, Row 2, Col 2 (PATRIOT CERTIFICATE)
 */

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const PatriotIDBadge: React.FC<BadgeProps> = ({
  photoUri,
  displayName,
  stats,
  showTotal,
  showCurrentStreak,
  showLongestStreak,
  showMemberSince,
  t,
  scale = 1,
}) => {
  const width = 340 * scale;
  const height = 212 * scale;

  const formatDate = (date?: Date) => {
    if (!date) return "XXXX";
    return new Date(date).getFullYear().toString();
  };

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Left dark panel */}
      <LinearGradient
        colors={["#3d2d2d", "#2d1f1f", "#1d1515"]}
        style={[styles.leftPanel, { width: width * 0.38 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Right gradient panel */}
      <LinearGradient
        colors={["#5c4040", "#4d3535", "#3d2a2a"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.4, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View style={[styles.header, { height: 28 * scale }]}>
        <Text style={[styles.headerText, { fontSize: 11 * scale }]}>
          PATRIOT CERTIFICATE
        </Text>
      </View>

      <View style={styles.mainContent}>
        {/* Left section - Photo */}
        <View style={[styles.leftSection, { width: width * 0.38 }]}>
          <View
            style={[
              styles.photoContainer,
              {
                width: 70 * scale,
                height: 82 * scale,
                borderRadius: 6 * scale,
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
                    height: 76 * scale,
                    borderRadius: 4 * scale,
                  },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.photoPlaceholder,
                  {
                    width: 64 * scale,
                    height: 76 * scale,
                    borderRadius: 4 * scale,
                  },
                ]}
              >
                <Text style={[styles.initial, { fontSize: 28 * scale }]}>
                  {displayName.charAt(0).toUpperCase() || "A"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Right section - Info */}
        <View style={[styles.rightSection, { paddingLeft: 12 * scale }]}>
          {/* Name */}
          <Text
            style={[styles.name, { fontSize: 14 * scale }]}
            numberOfLines={1}
          >
            {displayName || t("dedicated_patriot")}
          </Text>

          {/* Member since */}
          {showMemberSince && (
            <Text style={[styles.memberSince, { fontSize: 9 * scale }]}>
              Member since: {formatDate(stats?.memberSince)}
            </Text>
          )}

          {/* Stats */}
          <View style={[styles.statsContainer, { marginTop: 8 * scale }]}>
            {showTotal && stats && (
              <View style={styles.statRow}>
                <Text style={{ fontSize: 12 * scale }}>🏆</Text>
                <Text style={[styles.statValue, { fontSize: 12 * scale }]}>
                  {stats.completedCeremonies}
                </Text>
                <Text style={[styles.statLabel, { fontSize: 10 * scale }]}>
                  {t("ceremonies").toUpperCase()}
                </Text>
              </View>
            )}
            {showCurrentStreak && stats && (
              <View style={styles.statRow}>
                <Text style={{ fontSize: 12 * scale }}>🔥</Text>
                <Text style={[styles.statLabel, { fontSize: 10 * scale }]}>
                  {t("current_streak")}:
                </Text>
                <Text style={[styles.statValue, { fontSize: 10 * scale }]}>
                  {stats.currentStreak} {t("days")}
                </Text>
              </View>
            )}
            {showLongestStreak && stats && (
              <View style={styles.statRow}>
                <Text style={{ fontSize: 12 * scale }}>⚡</Text>
                <Text style={[styles.statLabel, { fontSize: 10 * scale }]}>
                  {t("longest_streak")}:
                </Text>
                <Text style={[styles.statValue, { fontSize: 10 * scale }]}>
                  {stats.longestStreak} {t("days")}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { height: 20 * scale }]}>
        <Text style={[styles.footerId, { fontSize: 8 * scale }]}>
          ID: 00012345
        </Text>
        <Text style={[styles.footerUrl, { fontSize: 8 * scale }]}>
          www.flag-ceremony.app
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 12,
  },
  leftPanel: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(251, 191, 36, 0.3)",
  },
  headerText: {
    color: "#fbbf24",
    fontWeight: "700",
    letterSpacing: 2,
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },
  leftSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  photoContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fbbf24",
  },
  photo: {
    resizeMode: "cover",
  },
  photoPlaceholder: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: "#fbbf24",
    fontWeight: "700",
  },
  rightSection: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 12,
  },
  name: {
    color: "#ffffff",
    fontWeight: "700",
  },
  memberSince: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
    marginTop: 2,
  },
  statsContainer: {
    gap: 4,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    color: "#ffffff",
    fontWeight: "700",
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(251, 191, 36, 0.2)",
  },
  footerId: {
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "500",
  },
  footerUrl: {
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "500",
  },
});

