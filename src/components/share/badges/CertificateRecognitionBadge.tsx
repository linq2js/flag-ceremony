/**
 * CertificateRecognitionBadge - Certificate with ranking badge
 * Based on Image 2, Row 3, Col 3 (CERTIFICATE OF RECOGNITION)
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const CertificateRecognitionBadge: React.FC<BadgeProps> = ({
  displayName,
  stats,
  showTotal,
  showCurrentStreak,
  showLongestStreak,
  showRanking,
  t,
  scale = 1,
}) => {
  const width = 360 * scale;
  const height = 270 * scale;

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Cream/parchment background */}
      <LinearGradient
        colors={["#faf8f5", "#f5f0e8", "#ebe4d8"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Border */}
      <View
        style={[
          styles.border,
          { margin: 8 * scale, borderWidth: 2 * scale, borderRadius: 6 * scale },
        ]}
      >
        <View style={styles.content}>
          {/* Header */}
          <Text style={[styles.header, { fontSize: 12 * scale }]}>
            CERTIFICATE OF RECOGNITION
          </Text>

          {/* Decorative line */}
          <View
            style={[
              styles.decorLine,
              { width: 120 * scale, height: 2 * scale, marginTop: 6 * scale },
            ]}
          />

          {/* "This certifies that" */}
          <Text style={[styles.certifiesText, { fontSize: 9 * scale }]}>
            This certifies that
          </Text>

          {/* Achievement box */}
          {showTotal && stats && (
            <View
              style={[
                styles.achievementBox,
                {
                  paddingHorizontal: 20 * scale,
                  paddingVertical: 8 * scale,
                  marginTop: 10 * scale,
                },
              ]}
            >
              <Text style={{ fontSize: 14 * scale }}>🏆</Text>
              <Text style={[styles.achievementValue, { fontSize: 24 * scale }]}>
                {stats.completedCeremonies}
              </Text>
              <Text style={[styles.achievementLabel, { fontSize: 9 * scale }]}>
                {t("ceremonies").toUpperCase()}
              </Text>
            </View>
          )}

          {/* Stats row */}
          {(showCurrentStreak || showLongestStreak) && stats && (
            <View style={[styles.statsRow, { marginTop: 8 * scale }]}>
              {showCurrentStreak && (
                <Text style={[styles.statText, { fontSize: 8 * scale }]}>
                  🔥 {t("current_streak")}: {stats.currentStreak} {t("days")}
                </Text>
              )}
              {showLongestStreak && (
                <Text style={[styles.statText, { fontSize: 8 * scale }]}>
                  ⚡ {t("longest_streak")}: {stats.longestStreak} {t("days")}
                </Text>
              )}
            </View>
          )}

          {/* Ranking badge */}
          {showRanking && stats?.percentile && (
            <View
              style={[
                styles.rankingBadge,
                {
                  paddingHorizontal: 14 * scale,
                  paddingVertical: 4 * scale,
                  marginTop: 10 * scale,
                },
              ]}
            >
              <Text style={[styles.rankingText, { fontSize: 10 * scale }]}>
                Top {Math.ceil(100 - stats.percentile)}%
              </Text>
            </View>
          )}

          {/* Bottom row */}
          <View style={[styles.bottomRow, { marginTop: "auto" }]}>
            {/* Date */}
            <View style={styles.dateSection}>
              <Text style={[styles.dateLabel, { fontSize: 7 * scale }]}>
                Date
              </Text>
              <View
                style={[
                  styles.dateLine,
                  { width: 50 * scale, height: 1 * scale },
                ]}
              />
            </View>

            {/* Signature */}
            <View style={styles.signatureSection}>
              <Text style={[styles.signatureLabel, { fontSize: 7 * scale }]}>
                Signature
              </Text>
              <View
                style={[
                  styles.signatureLine,
                  { width: 50 * scale, height: 1 * scale },
                ]}
              />
            </View>
          </View>

          {/* Footer */}
          <Text style={[styles.footer, { fontSize: 7 * scale }]}>
            Flag Ceremony App
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 8,
  },
  border: {
    flex: 1,
    borderColor: "#d97706",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  header: {
    color: "#92400e",
    fontWeight: "700",
    letterSpacing: 1,
  },
  decorLine: {
    backgroundColor: "#d97706",
  },
  certifiesText: {
    color: "#78716c",
    fontStyle: "italic",
    marginTop: 8,
  },
  achievementBox: {
    backgroundColor: "rgba(217, 119, 6, 0.1)",
    borderWidth: 2,
    borderColor: "#d97706",
    borderRadius: 8,
    alignItems: "center",
  },
  achievementValue: {
    color: "#d97706",
    fontWeight: "800",
  },
  achievementLabel: {
    color: "#78716c",
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: -2,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statText: {
    color: "#78716c",
    fontWeight: "500",
  },
  rankingBadge: {
    backgroundColor: "rgba(217, 119, 6, 0.15)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d97706",
  },
  rankingText: {
    color: "#d97706",
    fontWeight: "700",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "80%",
  },
  dateSection: {
    alignItems: "center",
  },
  dateLabel: {
    color: "#a8a29e",
    marginBottom: 2,
  },
  dateLine: {
    backgroundColor: "#d6d3d1",
  },
  signatureSection: {
    alignItems: "center",
  },
  signatureLabel: {
    color: "#a8a29e",
    marginBottom: 2,
  },
  signatureLine: {
    backgroundColor: "#d6d3d1",
  },
  footer: {
    color: "#a8a29e",
    fontWeight: "500",
    marginTop: 6,
  },
});

