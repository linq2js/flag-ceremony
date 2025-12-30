/**
 * CertificateVNBadge - Vietnamese themed certificate
 * Based on Image 2, Row 2, Col 3 (VN FLAG CERTIFICATE)
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeProps } from "./types";

export const CertificateVNBadge: React.FC<BadgeProps> = ({
  displayName,
  stats,
  showTotal,
  t,
  scale = 1,
}) => {
  const width = 360 * scale;
  const height = 270 * scale;

  return (
    <View style={[styles.container, { width, height }]}>
      <LinearGradient
        colors={["#7f1d1d", "#5c1515", "#450a0a"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={styles.content}>
        {/* Header ribbon */}
        <View style={[styles.header, { paddingVertical: 8 * scale }]}>
          <Text style={{ fontSize: 12 * scale }}>🇻🇳</Text>
          <Text style={[styles.headerText, { fontSize: 11 * scale }]}>
            FLAG CERTIFICATE
          </Text>
          <Text style={{ fontSize: 12 * scale }}>🇻🇳</Text>
        </View>

        {/* Decorative stars */}
        <View style={[styles.starsRow, { marginTop: 6 * scale }]}>
          <Text style={{ fontSize: 12 * scale }}>⭐</Text>
          <Text style={{ fontSize: 14 * scale }}>⭐</Text>
          <Text style={{ fontSize: 12 * scale }}>⭐</Text>
        </View>

        {/* Main certificate box */}
        <View
          style={[
            styles.certificateBox,
            {
              marginTop: 10 * scale,
              paddingHorizontal: 20 * scale,
              paddingVertical: 12 * scale,
            },
          ]}
        >
          {/* "This certifies that" */}
          <Text style={[styles.certifiesText, { fontSize: 9 * scale }]}>
            This certifies that
          </Text>

          {/* Ceremony count */}
          {showTotal && stats && (
            <View style={[styles.countBox, { marginTop: 8 * scale }]}>
              <Text style={{ fontSize: 16 * scale }}>🏆</Text>
              <Text style={[styles.countValue, { fontSize: 28 * scale }]}>
                {stats.completedCeremonies}
              </Text>
              <Text style={[styles.countLabel, { fontSize: 10 * scale }]}>
                {t("ceremonies").toUpperCase()}
              </Text>
            </View>
          )}

          {/* Description */}
          <Text style={[styles.description, { fontSize: 8 * scale }]}>
            has demonstrated exceptional patriotism
          </Text>

          {/* Secondary count */}
          <View
            style={[
              styles.secondaryBox,
              {
                paddingHorizontal: 16 * scale,
                paddingVertical: 6 * scale,
                marginTop: 8 * scale,
              },
            ]}
          >
            <Text style={[styles.secondaryValue, { fontSize: 20 * scale }]}>
              {stats?.completedCeremonies || 0}
            </Text>
            <Text style={[styles.secondaryLabel, { fontSize: 8 * scale }]}>
              Flag Ceremonies Completed
            </Text>
          </View>
        </View>

        {/* Bottom row with seal */}
        <View style={[styles.bottomRow, { marginTop: "auto" }]}>
          {/* Date */}
          <View style={styles.dateSection}>
            <Text style={[styles.dateLabel, { fontSize: 7 * scale }]}>Date</Text>
            <View
              style={[styles.dateLine, { width: 50 * scale, height: 1 * scale }]}
            />
          </View>

          {/* Seal */}
          <View
            style={[
              styles.seal,
              {
                width: 40 * scale,
                height: 40 * scale,
                borderRadius: 20 * scale,
              },
            ]}
          >
            <Text style={{ fontSize: 16 * scale }}>🏅</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 12,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#fbbf24",
    width: "80%",
    justifyContent: "center",
  },
  headerText: {
    color: "#fbbf24",
    fontWeight: "700",
    letterSpacing: 2,
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  certificateBox: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: 2,
    borderColor: "#fbbf24",
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
  },
  certifiesText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic",
  },
  countBox: {
    alignItems: "center",
  },
  countValue: {
    color: "#fbbf24",
    fontWeight: "800",
  },
  countLabel: {
    color: "#ffffff",
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: -4,
  },
  description: {
    color: "rgba(255, 255, 255, 0.6)",
    fontStyle: "italic",
    marginTop: 4,
  },
  secondaryBox: {
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    borderRadius: 4,
    alignItems: "center",
  },
  secondaryValue: {
    color: "#a3e635",
    fontWeight: "700",
  },
  secondaryLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
    marginTop: -2,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "90%",
  },
  dateSection: {
    alignItems: "center",
  },
  dateLabel: {
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 2,
  },
  dateLine: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  seal: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    borderWidth: 2,
    borderColor: "#fbbf24",
    alignItems: "center",
    justifyContent: "center",
  },
  signatureSection: {
    alignItems: "center",
  },
  signatureLabel: {
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 2,
  },
  signatureLine: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  footer: {
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: "500",
    marginTop: 6,
  },
});

