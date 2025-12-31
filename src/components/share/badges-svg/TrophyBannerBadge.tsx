/**
 * TrophyBannerBadge SVG - Flag banner with trophy icon
 * Red gradient with decorative banner at top
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
  Path,
} from "react-native-svg";
import { SVGBadgeProps, FONT_FAMILY } from "./types";

export const TrophyBannerBadge: React.FC<SVGBadgeProps> = ({
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
        <LinearGradient id="trophyBgGradient" x1="0.5" y1="0" x2="0.5" y2="1">
          <Stop offset="0" stopColor="#7f1d1d" />
          <Stop offset="0.5" stopColor="#5c1515" />
          <Stop offset="1" stopColor="#450a0a" />
        </LinearGradient>
        <ClipPath id="trophyPhotoClip">
          <Circle cx="150" cy="120" r="29" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="16" fill="url(#trophyBgGradient)" />

      {/* Banner with top spacing */}
      <G transform="translate(0, 15)">
        <Path
          d="M20 0 L280 0 L280 28 L290 28 L280 36 L270 28 L30 28 L20 36 L10 28 L20 28 Z"
          fill="#dc2626"
        />
        <Path d="M25 3 L275 3 L275 25 L25 25 Z" fill="none" stroke="#fbbf24" strokeWidth="1" />
        <Text 
          x="150" 
          y="19" 
          textAnchor="middle" 
          fill="#fbbf24" 
          fontSize="12" 
          fontWeight="800" 
          letterSpacing={2}
          fontFamily={FONT_FAMILY}
        >
          {t("badge_flag_ceremony")}
        </Text>
      </G>

      {/* Trophy icon - moved down for spacing after ribbon */}
      <Text x="150" y="75" textAnchor="middle" fontSize="32">🏆</Text>

      {/* Photo container */}
      <Circle cx="150" cy="120" r="32" fill="#fbbf24" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="121"
          y="91"
          width="58"
          height="58"
          href={photoDataUri}
          clipPath="url(#trophyPhotoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="120" r="29" fill="#92400e" />
          <Text x="150" y="128" textAnchor="middle" fill="#fef3c7" fontSize="24" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Count */}
      {stats && (
        <G>
          <Text x="150" y="190" textAnchor="middle" fill="#fbbf24" fontSize="42" fontWeight="800" fontFamily={FONT_FAMILY}>
            {stats.completedCeremonies}
          </Text>
          <Text x="150" y="215" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600" letterSpacing={2} fontFamily={FONT_FAMILY}>
            {t("ceremonies").toUpperCase()}
          </Text>
        </G>
      )}

      {/* Stats */}
      {stats && (
        <Text x="150" y="255" textAnchor="middle" fill="rgba(255, 255, 255, 0.7)" fontSize="12" fontWeight="500" fontFamily={FONT_FAMILY}>
          🔥 {stats.currentStreak} | 🏆 {stats.longestStreak}
        </Text>
      )}
    </Svg>
  );
};
