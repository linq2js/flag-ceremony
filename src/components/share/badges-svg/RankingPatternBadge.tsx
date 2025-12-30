/**
 * RankingPatternBadge SVG - Ranking display with pattern
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

export const RankingPatternBadge: React.FC<SVGBadgeProps> = ({
  photoDataUri,
  displayName,
  stats,
  t,
  width = 300,
  height = 300,
}) => {
  const initial = (displayName || "A").charAt(0).toUpperCase();
  const percentile = stats?.percentile ?? 50;
  const topPercent = Math.ceil(100 - percentile);

  return (
    <Svg width={width} height={height} viewBox="0 0 300 300">
      <Defs>
        <LinearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#1e1e2e" />
          <Stop offset="0.5" stopColor="#181825" />
          <Stop offset="1" stopColor="#11111b" />
        </LinearGradient>
        <ClipPath id="photoClip">
          <Circle cx="150" cy="75" r="30" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="20" fill="url(#bgGradient)" />

      {/* Decorative pattern - diagonal lines */}
      {[...Array(10)].map((_, i) => (
        <Rect
          key={i}
          x={-50 + i * 40}
          y="0"
          width="2"
          height="400"
          fill="rgba(255, 255, 255, 0.03)"
          transform="rotate(-45 150 150)"
        />
      ))}

      {/* Photo container */}
      <Circle cx="150" cy="75" r="35" fill="rgba(250, 204, 21, 0.2)" stroke="#facc15" strokeWidth="3" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="120"
          y="45"
          width="60"
          height="60"
          href={photoDataUri}
          clipPath="url(#photoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="75" r="30" fill="rgba(250, 204, 21, 0.3)" />
          <Text x="150" y="85" textAnchor="middle" fill="#facc15" fontSize="24" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Name */}
      <Text x="150" y="135" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700" fontFamily={FONT_FAMILY}>
        {displayName || t("dedicated_patriot")}
      </Text>

      {/* Ranking header */}
      <Text x="150" y="160" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="10" fontWeight="600" letterSpacing={2} fontFamily={FONT_FAMILY}>
        {t("badge_ranking")}
      </Text>

      {/* Large ranking */}
      <Text x="150" y="215" textAnchor="middle" fill="#facc15" fontSize="48" fontWeight="900" fontFamily={FONT_FAMILY}>
        {t("badge_top")} {topPercent}%
      </Text>

      {/* Stats */}
      {stats && (
        <G>
          <Text x="100" y="255" textAnchor="middle" fill="rgba(255, 255, 255, 0.7)" fontSize="10" fontFamily={FONT_FAMILY}>
            🔥 {stats.currentStreak} {t("days")}
          </Text>
          <Text x="200" y="255" textAnchor="middle" fill="rgba(255, 255, 255, 0.7)" fontSize="10" fontFamily={FONT_FAMILY}>
            🏆 {stats.completedCeremonies}
          </Text>
        </G>
      )}

      {/* Footer */}
      <Text x="150" y="285" textAnchor="middle" fill="rgba(255, 255, 255, 0.4)" fontSize="9" fontWeight="600" letterSpacing={1} fontFamily={FONT_FAMILY}>
        🇻🇳 {t("badge_flag_ceremony")}
      </Text>
    </Svg>
  );
};
