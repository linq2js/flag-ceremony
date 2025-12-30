/**
 * CertificateDedicationBadge - Formal diploma certificate
 * Based on Image 1, Row 2, Col 3 (CERTIFICATE OF DEDICATION)
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const CertificateDedicationBadge: React.FC<BadgeProps> = ({
  displayName,
  stats,
  t,
  scale = 1,
}) => {
  const width = 360 * scale;
  const height = 270 * scale;

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Parchment-like background */}
      <LinearGradient
        colors={["#f5f0e6", "#ebe4d4", "#e0d8c8"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Ornate border */}
      <View
        style={[
          styles.border,
          {
            margin: 10 * scale,
            borderWidth: 3 * scale,
            borderRadius: 4 * scale,
          },
        ]}
      >
        {/* Inner decorative border */}
        <View
          style={[
            styles.innerBorder,
            {
              margin: 4 * scale,
              borderWidth: 1 * scale,
            },
          ]}
        >
          <View style={styles.content}>
            {/* Header */}
            <Text style={[styles.header, { fontSize: 14 * scale }]}>
              {t("badge_certificate_of_dedication")}
            </Text>

            {/* Decorative line */}
            <View
              style={[
                styles.decorLine,
                { width: 100 * scale, height: 2 * scale, marginTop: 6 * scale },
              ]}
            />

            {/* Name */}
            <Text
              style={[
                styles.name,
                { fontSize: 20 * scale, marginTop: 12 * scale },
              ]}
              numberOfLines={1}
            >
              {displayName || t("dedicated_patriot")}
            </Text>

            {/* Description */}
            <Text style={[styles.description, { fontSize: 9 * scale }]}>
              {t("badge_demonstrated_patriotism")}
            </Text>

            {/* Achievement box */}
            {stats && (
              <View
                style={[
                  styles.achievementBox,
                  {
                    paddingHorizontal: 20 * scale,
                    paddingVertical: 8 * scale,
                    marginTop: 12 * scale,
                  },
                ]}
              >
                <Text style={[styles.achievementValue, { fontSize: 18 * scale }]}>
                  {stats.completedCeremonies}
                </Text>
                <Text style={[styles.achievementLabel, { fontSize: 9 * scale }]}>
                  {t("badge_ceremonies_completed")}
                </Text>
              </View>
            )}

            {/* Stats */}
            {stats && (
              <View style={[styles.statsRow, { marginTop: 8 * scale }]}>
                <Text style={[styles.statText, { fontSize: 8 * scale }]}>
                  {t("current_streak")}: {stats.currentStreak} {t("days")}
                </Text>
                <Text style={[styles.divider, { fontSize: 8 * scale }]}>
                  {" "}|{" "}
                </Text>
                <Text style={[styles.statText, { fontSize: 8 * scale }]}>
                  {t("longest_streak")}: {stats.longestStreak} {t("days")}
                </Text>
              </View>
            )}

            {/* Bottom row */}
            <View style={[styles.bottomRow, { marginTop: "auto" }]}>
              {/* Date */}
              <View style={styles.dateSection}>
                <Text style={[styles.dateLabel, { fontSize: 7 * scale }]}>
                  {t("badge_date")}: {formatDate()}
                </Text>
              </View>

              {/* Signature */}
              <View style={styles.signatureSection}>
                <View
                  style={[
                    styles.signatureLine,
                    { width: 50 * scale, height: 1 * scale },
                  ]}
                />
                <Text style={[styles.signatureLabel, { fontSize: 6 * scale }]}>
                  {t("badge_signature")}
                </Text>
              </View>

              {/* Seal */}
              <View
                style={[
                  styles.seal,
                  {
                    width: 36 * scale,
                    height: 36 * scale,
                    borderRadius: 18 * scale,
                  },
                ]}
              >
                <Text style={{ fontSize: 14 * scale }}>🏅</Text>
              </View>
            </View>

            {/* Footer */}
            <Text style={[styles.footer, { fontSize: 6 * scale }]}>
              {t("app_name")}
            </Text>
          </View>
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
    borderColor: "#b8860b",
  },
  innerBorder: {
    flex: 1,
    borderColor: "rgba(184, 134, 11, 0.4)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  header: {
    color: "#5c4033",
    fontWeight: "700",
    letterSpacing: 2,
  },
  decorLine: {
    backgroundColor: "#b8860b",
  },
  name: {
    color: "#3d2817",
    fontWeight: "700",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 36,
    paddingBottom: 4,
  },
  description: {
    color: "#5c4033",
    fontStyle: "italic",
    marginTop: 4,
  },
  achievementBox: {
    backgroundColor: "rgba(184, 134, 11, 0.15)",
    borderWidth: 2,
    borderColor: "#b8860b",
    borderRadius: 6,
    alignItems: "center",
  },
  achievementValue: {
    color: "#b8860b",
    fontWeight: "800",
  },
  achievementLabel: {
    color: "#5c4033",
    fontWeight: "500",
    marginTop: -2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    color: "#6b5344",
    fontWeight: "500",
  },
  divider: {
    color: "#9b8b7a",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 4,
  },
  dateSection: {},
  dateLabel: {
    color: "#6b5344",
    fontWeight: "500",
  },
  signatureSection: {
    alignItems: "center",
  },
  signatureLine: {
    backgroundColor: "#9b8b7a",
    marginBottom: 2,
  },
  signatureLabel: {
    color: "#9b8b7a",
    fontStyle: "italic",
  },
  seal: {
    backgroundColor: "rgba(184, 134, 11, 0.2)",
    borderWidth: 2,
    borderColor: "#b8860b",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    color: "#9b8b7a",
    fontWeight: "500",
    marginTop: 4,
  },
});
