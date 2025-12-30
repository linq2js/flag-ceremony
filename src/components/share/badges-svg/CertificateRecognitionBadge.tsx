/**
 * CertificateRecognitionBadge SVG - Recognition certificate
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

export const CertificateRecognitionBadge: React.FC<SVGBadgeProps> = ({
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
        <LinearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#fefcf3" />
          <Stop offset="0.5" stopColor="#f5f0e1" />
          <Stop offset="1" stopColor="#ebe4d0" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="360" height="270" rx="8" fill="url(#bgGradient)" />

      {/* Border */}
      <Rect x="8" y="8" width="344" height="254" rx="4" fill="none" stroke="#c9a227" strokeWidth="2" />
      <Rect x="14" y="14" width="332" height="242" rx="2" fill="none" stroke="rgba(201, 162, 39, 0.3)" strokeWidth="1" />

      {/* Header */}
      <Text x="180" y="45" textAnchor="middle" fill="#5c4033" fontSize="12" fontWeight="700" letterSpacing={2} fontFamily={FONT_FAMILY}>
        {t("badge_certificate_of_recognition")}
      </Text>

      {/* Decorative elements */}
      <Line x1="80" y1="55" x2="130" y2="55" stroke="#c9a227" strokeWidth="1" />
      <Text x="180" y="58" textAnchor="middle" fontSize="12">⭐</Text>
      <Line x1="230" y1="55" x2="280" y2="55" stroke="#c9a227" strokeWidth="1" />

      {/* This certifies text */}
      <Text x="180" y="80" textAnchor="middle" fill="#6b5344" fontSize="10" fontStyle="italic" fontFamily={FONT_FAMILY}>
        {t("badge_this_certifies")}
      </Text>

      {/* Name */}
      <Text x="180" y="110" textAnchor="middle" fill="#3d2817" fontSize="22" fontWeight="700" fontFamily={FONT_FAMILY}>
        {displayName || t("dedicated_patriot")}
      </Text>

      {/* Underline */}
      <Line x1="100" y1="118" x2="260" y2="118" stroke="#c9a227" strokeWidth="1" />

      {/* Description */}
      <Text x="180" y="140" textAnchor="middle" fill="#5c4033" fontSize="9" fontFamily={FONT_FAMILY}>
        {t("badge_demonstrated_patriotism")}
      </Text>

      {/* Stats */}
      {stats && (
        <G>
          <Text x="180" y="170" textAnchor="middle" fill="#c9a227" fontSize="28" fontWeight="800" fontFamily={FONT_FAMILY}>
            {stats.completedCeremonies}
          </Text>
          <Text x="180" y="188" textAnchor="middle" fill="#5c4033" fontSize="10" fontWeight="500" fontFamily={FONT_FAMILY}>
            {t("badge_ceremonies_completed")}
          </Text>
        </G>
      )}

      {/* Bottom section */}
      <Text x="60" y="225" fill="#6b5344" fontSize="8" fontFamily={FONT_FAMILY}>
        {t("badge_date")}: {formatDate()}
      </Text>

      <Line x1="150" y1="220" x2="210" y2="220" stroke="#9b8b7a" strokeWidth="1" />
      <Text x="180" y="232" textAnchor="middle" fill="#9b8b7a" fontSize="7" fontStyle="italic" fontFamily={FONT_FAMILY}>
        {t("badge_signature")}
      </Text>

      {/* Seal */}
      <Circle cx="300" cy="215" r="20" fill="rgba(201, 162, 39, 0.15)" stroke="#c9a227" strokeWidth="2" />
      <Text x="300" y="222" textAnchor="middle" fontSize="16">🎖️</Text>

      {/* Footer */}
      <Text x="180" y="258" textAnchor="middle" fill="#9b8b7a" fontSize="7" fontWeight="500" fontFamily={FONT_FAMILY}>
        🇻🇳 {t("badge_flag_ceremony")} 🇻🇳
      </Text>
    </Svg>
  );
};
