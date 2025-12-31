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
        <LinearGradient id="oliveBgGradient" x1="0" y1="0" x2="0.5" y2="1">
          <Stop offset="0" stopColor="#4d4d33" />
          <Stop offset="0.5" stopColor="#3d3d29" />
          <Stop offset="1" stopColor="#2d2d1f" />
        </LinearGradient>
        <ClipPath id="olivePhotoClip">
          <Circle cx="150" cy="95" r="54" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="16" fill="url(#oliveBgGradient)" />

      {/* Header */}
      <Text x="150" y="26" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700" letterSpacing={2} fontFamily={FONT_FAMILY}>
        🇻🇳 {t("badge_flag_ceremony")} 🇻🇳
      </Text>
      <Line x1="40" y1="38" x2="260" y2="38" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="1" />

      {/* Stars */}
      <Text x="125" y="56" fontSize="14">⭐</Text>
      <Text x="145" y="56" fontSize="17">⭐</Text>
      <Text x="165" y="56" fontSize="14">⭐</Text>

      {/* Photo container */}
      <Circle cx="150" cy="95" r="59" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" strokeWidth="3" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="97"
          y="42"
          width="107"
          height="107"
          href={photoDataUri}
          clipPath="url(#olivePhotoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="95" r="54" fill="rgba(251, 191, 36, 0.3)" />
          <Text x="150" y="112" textAnchor="middle" fill="#fbbf24" fontSize="35" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Name */}
      <Text 
        x="150" 
        y="195" 
        textAnchor="middle" 
        fill="#fafaf9" 
        fontSize="21" 
        fontWeight="700" 
        fontFamily={FONT_FAMILY}
      >
        {((displayName || t("dedicated_patriot")).length > 18 
          ? (displayName || t("dedicated_patriot")).substring(0, 18) + "..." 
          : (displayName || t("dedicated_patriot"))).toUpperCase()}
      </Text>

      {/* Description */}
      <Text x="150" y="216" textAnchor="middle" fill="rgba(250, 250, 249, 0.6)" fontSize="14" fontStyle="italic" fontFamily={FONT_FAMILY}>
        This commemorates that
      </Text>

      {/* Stats */}
      {stats && (
        <G>
          <Text x="150" y="240" textAnchor="middle" fill="rgba(250, 250, 249, 0.8)" fontSize="14" fontFamily={FONT_FAMILY}>
            🔥 {t("current_streak")}: {stats.currentStreak}
          </Text>
          <Text x="150" y="260" textAnchor="middle" fill="rgba(250, 250, 249, 0.8)" fontSize="14" fontFamily={FONT_FAMILY}>
            ⚡ {t("longest_streak")}: {stats.longestStreak}
          </Text>
          {stats.percentile !== undefined && (
            <Text x="150" y="280" textAnchor="middle" fill="rgba(250, 250, 249, 0.8)" fontSize="14" fontFamily={FONT_FAMILY}>
              👑 Top {Math.max(1, Math.ceil(100 - stats.percentile))}%
            </Text>
          )}
        </G>
      )}
    </Svg>
  );
};
