/**
 * SimpleOliveBadge SVG - Military olive tone card
 */

import React from "react";
import Svg, {
  Rect,
  Text,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
  Image,
  G,
  Line,
} from "react-native-svg";
import { SVGBadgeProps, FONT_FAMILY } from "./types";

export const SimpleOliveBadge: React.FC<SVGBadgeProps> = ({
  photoDataUri,
  displayName,
  stats,
  t,
  width = 300,
  height = 300,
}) => {
  const initial = (displayName || "A").charAt(0).toUpperCase();

  return (
    <Svg width={width} height={height} viewBox="0 0 300 300">
      <Defs>
        <LinearGradient id="bgGradient" x1="0" y1="0" x2="0.5" y2="1">
          <Stop offset="0" stopColor="#4d4d33" />
          <Stop offset="0.5" stopColor="#3d3d29" />
          <Stop offset="1" stopColor="#2d2d1f" />
        </LinearGradient>
        <ClipPath id="photoClip">
          <Circle cx="150" cy="95" r="29" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="16" fill="url(#bgGradient)" />

      {/* Header */}
      <Text x="150" y="28" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="700" letterSpacing={2} fontFamily={FONT_FAMILY}>
        🇻🇳 {t("badge_flag_ceremony")} 🇻🇳
      </Text>
      <Line x1="50" y1="36" x2="250" y2="36" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="1" />

      {/* Stars */}
      <Text x="135" y="55" fontSize="12">⭐</Text>
      <Text x="145" y="55" fontSize="14">⭐</Text>
      <Text x="157" y="55" fontSize="12">⭐</Text>

      {/* Photo container */}
      <Circle cx="150" cy="95" r="32" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" strokeWidth="2" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="121"
          y="66"
          width="58"
          height="58"
          href={photoDataUri}
          clipPath="url(#photoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="95" r="29" fill="rgba(251, 191, 36, 0.3)" />
          <Text x="150" y="103" textAnchor="middle" fill="#fbbf24" fontSize="24" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Name */}
      <Text 
        x="150" 
        y="150" 
        textAnchor="middle" 
        fill="#fafaf9" 
        fontSize="14" 
        fontWeight="700" 
        fontFamily={FONT_FAMILY}
      >
        {((displayName || t("dedicated_patriot")).length > 20 
          ? (displayName || t("dedicated_patriot")).substring(0, 20) + "..." 
          : (displayName || t("dedicated_patriot"))).toUpperCase()}
      </Text>

      {/* Description */}
      <Text x="150" y="168" textAnchor="middle" fill="rgba(250, 250, 249, 0.6)" fontSize="9" fontStyle="italic" fontFamily={FONT_FAMILY}>
        This commemorates that
      </Text>

      {/* Stats */}
      {stats && (
        <G>
          <Text x="150" y="195" textAnchor="middle" fill="rgba(250, 250, 249, 0.8)" fontSize="10" fontFamily={FONT_FAMILY}>
            🔥 {t("current_streak")}: {stats.currentStreak} {t("days")}
          </Text>
          <Text x="150" y="212" textAnchor="middle" fill="rgba(250, 250, 249, 0.8)" fontSize="10" fontFamily={FONT_FAMILY}>
            ⚡ {t("longest_streak")}: {stats.longestStreak} {t("days")}
          </Text>
        </G>
      )}
    </Svg>
  );
};
