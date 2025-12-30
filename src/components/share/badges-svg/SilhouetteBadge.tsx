/**
 * SilhouetteBadge SVG - Minimalist silhouette design
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

export const SilhouetteBadge: React.FC<SVGBadgeProps> = ({
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
        <LinearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#1a1a2e" />
          <Stop offset="1" stopColor="#16213e" />
        </LinearGradient>
        <ClipPath id="photoClip">
          <Circle cx="150" cy="80" r="35" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="16" fill="url(#bgGradient)" />

      {/* Photo container */}
      <Circle cx="150" cy="80" r="40" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="115"
          y="45"
          width="70"
          height="70"
          href={photoDataUri}
          clipPath="url(#photoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="80" r="35" fill="rgba(255, 255, 255, 0.15)" />
          <Text x="150" y="90" textAnchor="middle" fill="#ffffff" fontSize="28" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Name */}
      <Text 
        x="150" 
        y="145" 
        textAnchor="middle" 
        fill="#ffffff" 
        fontSize="16" 
        fontWeight="700" 
        fontFamily={FONT_FAMILY}
      >
        {((displayName || t("dedicated_patriot")).length > 18 
          ? (displayName || t("dedicated_patriot")).substring(0, 18) + "..." 
          : (displayName || t("dedicated_patriot")))}
      </Text>

      {/* Count */}
      {stats && (
        <G>
          <Text x="150" y="200" textAnchor="middle" fill="#ffffff" fontSize="48" fontWeight="800" fontFamily={FONT_FAMILY}>
            {stats.completedCeremonies}
          </Text>
          <Text x="150" y="225" textAnchor="middle" fill="rgba(255, 255, 255, 0.7)" fontSize="11" fontWeight="500" fontFamily={FONT_FAMILY}>
            {t("ceremonies")}
          </Text>
        </G>
      )}

      {/* Stats row */}
      {stats && (
        <Text x="150" y="260" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="10" fontWeight="500" fontFamily={FONT_FAMILY}>
          {t("current_streak")}: {stats.currentStreak} {t("days")} | {t("cool_streak")}: {stats.longestStreak} {t("days")}
        </Text>
      )}
    </Svg>
  );
};
