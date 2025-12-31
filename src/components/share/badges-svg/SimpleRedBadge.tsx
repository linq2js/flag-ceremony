/**
 * SimpleRedBadge SVG - Clean red card with photo, name, stars, and stats
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

export const SimpleRedBadge: React.FC<SVGBadgeProps> = ({
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
        {/* Gradient background */}
        <LinearGradient id="simpleRedBgGradient" x1="0.5" y1="0" x2="0.5" y2="1">
          <Stop offset="0" stopColor="#8b0000" />
          <Stop offset="0.5" stopColor="#5c0000" />
          <Stop offset="1" stopColor="#3d0000" />
        </LinearGradient>

        {/* Photo clip path */}
        <ClipPath id="simpleRedPhotoClip">
          <Circle cx="150" cy="85" r="43" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="16" fill="url(#simpleRedBgGradient)" />

      {/* Photo ring (outer glow) */}
      <Circle cx="150" cy="85" r="50" fill="rgba(255, 215, 0, 0.3)" />

      {/* Photo container (gold ring) */}
      <Circle cx="150" cy="85" r="45" fill="#fbbf24" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="107"
          y="42"
          width="86"
          height="86"
          href={photoDataUri}
          clipPath="url(#simpleRedPhotoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="85" r="43" fill="#dc2626" />
          <Text x="150" y="98" textAnchor="middle" fill="#ffffff" fontSize="36" fontWeight="800" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Name */}
      <Text 
        x="150" 
        y="165" 
        textAnchor="middle" 
        fill="#ffffff" 
        fontSize="18" 
        fontWeight="700" 
        fontFamily={FONT_FAMILY}
      >
        {((displayName || t("dedicated_patriot")).length > 18 
          ? (displayName || t("dedicated_patriot")).substring(0, 18) + "..." 
          : (displayName || t("dedicated_patriot")))}
      </Text>

      {/* Stars row */}
      <Text x="120" y="195" fontSize="16">⭐</Text>
      <Text x="143" y="195" fontSize="12">🇻🇳</Text>
      <Text x="166" y="195" fontSize="16">⭐</Text>

      {/* Stats */}
      {stats && (
        <Text 
          x="150" 
          y="250" 
          textAnchor="middle" 
          fill="rgba(255, 255, 255, 0.8)" 
          fontSize="15" 
          fontWeight="500" 
          fontFamily={FONT_FAMILY}
        >
          🔥 {t("current_streak")}: {stats.currentStreak} ⚡ {t("best_streak")}: {stats.longestStreak}
        </Text>
      )}
    </Svg>
  );
};
