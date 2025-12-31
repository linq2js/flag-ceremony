/**
 * MilitaryStarsBadge SVG - Stars header military style
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
} from "react-native-svg";
import { SVGBadgeProps, FONT_FAMILY } from "./types";

export const MilitaryStarsBadge: React.FC<SVGBadgeProps> = ({
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
        <LinearGradient id="militaryBgGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#3d3d29" />
          <Stop offset="0.5" stopColor="#2d2d1f" />
          <Stop offset="1" stopColor="#1d1d15" />
        </LinearGradient>
        <ClipPath id="militaryPhotoClip">
          <Circle cx="150" cy="100" r="35" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="16" fill="url(#militaryBgGradient)" />

      {/* Decorative border */}
      <Rect x="8" y="8" width="284" height="284" rx="12" fill="none" stroke="#fbbf24" strokeWidth="2" />

      {/* Header - flags on left and right of title */}
      <Text x="70" y="32" fontSize="12">🇻🇳</Text>
      <Text x="150" y="32" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="700" letterSpacing={1} fontFamily={FONT_FAMILY}>
        {t("badge_flag_ceremony")}
      </Text>
      <Text x="218" y="32" fontSize="12">🇻🇳</Text>

      {/* Stars row - 5 stars */}
      <Text x="110" y="55" fontSize="14">⭐</Text>
      <Text x="126" y="55" fontSize="15">⭐</Text>
      <Text x="143" y="55" fontSize="17">⭐</Text>
      <Text x="160" y="55" fontSize="15">⭐</Text>
      <Text x="176" y="55" fontSize="14">⭐</Text>

      {/* Photo container - 30% larger */}
      <Circle cx="150" cy="100" r="39" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" strokeWidth="2" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="115"
          y="65"
          width="70"
          height="70"
          href={photoDataUri}
          clipPath="url(#militaryPhotoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="100" r="35" fill="rgba(251, 191, 36, 0.3)" />
          <Text x="150" y="110" textAnchor="middle" fill="#fbbf24" fontSize="28" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Name - 20% larger font */}
      <Text 
        x="150" 
        y="160" 
        textAnchor="middle" 
        fill="#fafaf9" 
        fontSize="14" 
        fontWeight="700" 
        fontFamily={FONT_FAMILY}
      >
        {((displayName || t("dedicated_patriot")).length > 22 
          ? (displayName || t("dedicated_patriot")).substring(0, 22) + "..." 
          : (displayName || t("dedicated_patriot"))).toUpperCase()}
      </Text>

      {/* Description - 20% larger font */}
      <Text x="150" y="178" textAnchor="middle" fill="rgba(250, 250, 249, 0.5)" fontSize="10" fontStyle="italic" fontFamily={FONT_FAMILY}>
        This commemorates that
      </Text>

      {/* Stats - 20% larger font */}
      {stats && (
        <G>
          <Text x="150" y="202" textAnchor="middle" fill="rgba(250, 250, 249, 0.8)" fontSize="11" fontFamily={FONT_FAMILY}>
            🔥 {t("current_streak")}: {stats.currentStreak} {t("days")}
          </Text>
          <Text x="150" y="220" textAnchor="middle" fill="rgba(250, 250, 249, 0.8)" fontSize="11" fontFamily={FONT_FAMILY}>
            ⚡ {t("longest_streak")}: {stats.longestStreak} {t("days")}
          </Text>
          {stats?.percentile && (
            <Text x="150" y="238" textAnchor="middle" fill="rgba(250, 250, 249, 0.8)" fontSize="11" fontFamily={FONT_FAMILY}>
              👑 {t("badge_top")} {Math.ceil(100 - stats.percentile)}%
            </Text>
          )}
        </G>
      )}
    </Svg>
  );
};
