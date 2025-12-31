/**
 * CertificateDedicationBadge SVG - Formal diploma certificate
 */

import React from "react";
import Svg, {
  Rect,
  Text,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  G,
  Line,
} from "react-native-svg";
import { SVGBadgeProps, FONT_FAMILY } from "./types";

export const CertificateDedicationBadge: React.FC<SVGBadgeProps> = ({
  displayName,
  stats,
  t,
  width = 360,
  height = 270,
}) => {
  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Svg width={width} height={height} viewBox="0 0 360 270">
      <Defs>
        <LinearGradient id="dedicationBgGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#f5f0e6" />
          <Stop offset="0.5" stopColor="#ebe4d4" />
          <Stop offset="1" stopColor="#e0d8c8" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="360" height="270" rx="8" fill="url(#dedicationBgGradient)" />

      {/* Ornate border */}
      <Rect x="10" y="10" width="340" height="250" rx="4" fill="none" stroke="#b8860b" strokeWidth="3" />
      <Rect x="16" y="16" width="328" height="238" rx="2" fill="none" stroke="rgba(184, 134, 11, 0.4)" strokeWidth="1" />

      {/* Header */}
      <Text x="180" y="50" textAnchor="middle" fill="#5c4033" fontSize="14" fontWeight="700" letterSpacing={2} fontFamily={FONT_FAMILY}>
        {t("badge_certificate_of_dedication")}
      </Text>

      {/* Decorative line */}
      <Line x1="130" y1="60" x2="230" y2="60" stroke="#b8860b" strokeWidth="2" />

      {/* Name */}
      <Text 
        x="180" 
        y="95" 
        textAnchor="middle" 
        fill="#3d2817" 
        fontSize="20" 
        fontWeight="700" 
        fontStyle="italic" 
        fontFamily={FONT_FAMILY}
      >
        {((displayName || t("dedicated_patriot")).length > 20 
          ? (displayName || t("dedicated_patriot")).substring(0, 20) + "..." 
          : (displayName || t("dedicated_patriot")))}
      </Text>

      {/* Description */}
      <Text x="180" y="115" textAnchor="middle" fill="#5c4033" fontSize="9" fontStyle="italic" fontFamily={FONT_FAMILY}>
        {t("badge_demonstrated_patriotism")}
      </Text>

      {/* Achievement box - 30% wider */}
      {stats && (
        <G>
          <Rect x="115" y="130" width="130" height="45" rx="6" fill="rgba(184, 134, 11, 0.15)" stroke="#b8860b" strokeWidth="2" />
          <Text x="180" y="155" textAnchor="middle" fill="#b8860b" fontSize="18" fontWeight="800" fontFamily={FONT_FAMILY}>
            {stats.completedCeremonies}
          </Text>
          <Text x="180" y="170" textAnchor="middle" fill="#5c4033" fontSize="9" fontWeight="500" fontFamily={FONT_FAMILY}>
            {t("badge_ceremonies_completed")}
          </Text>
        </G>
      )}

      {/* Stats */}
      {stats && (
        <Text x="180" y="195" textAnchor="middle" fill="#6b5344" fontSize="8" fontWeight="500" fontFamily={FONT_FAMILY}>
          {t("current_streak")}: {stats.currentStreak} {t("days")} | {t("longest_streak")}: {stats.longestStreak} {t("days")}
        </Text>
      )}

      {/* Bottom row */}
      <Text x="40" y="230" fill="#6b5344" fontSize="7" fontWeight="500" fontFamily={FONT_FAMILY}>
        {t("badge_date")}: {formatDate()}
      </Text>

      <Line x1="145" y1="225" x2="195" y2="225" stroke="#9b8b7a" strokeWidth="1" />
      <Text x="170" y="235" textAnchor="middle" fill="#9b8b7a" fontSize="6" fontStyle="italic" fontFamily={FONT_FAMILY}>
        {t("badge_signature")}
      </Text>

      {/* Seal */}
      <Circle cx="310" cy="220" r="18" fill="rgba(184, 134, 11, 0.2)" stroke="#b8860b" strokeWidth="2" />
      <Text x="310" y="226" textAnchor="middle" fontSize="14">🏅</Text>

      {/* Footer */}
      <Text x="180" y="258" textAnchor="middle" fill="#9b8b7a" fontSize="6" fontWeight="500" fontFamily={FONT_FAMILY}>
        {t("app_name")}
      </Text>
    </Svg>
  );
};
