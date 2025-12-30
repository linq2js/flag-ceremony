/**
 * SimpleOrangeBadge SVG - Warm orange minimalist card
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

export const SimpleOrangeBadge: React.FC<SVGBadgeProps> = ({
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
        <LinearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#fef3c7" />
          <Stop offset="0.5" stopColor="#fcd34d" />
          <Stop offset="1" stopColor="#f59e0b" />
        </LinearGradient>
        <ClipPath id="photoClip">
          <Circle cx="150" cy="56" r="29" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="20" fill="url(#bgGradient)" />

      {/* Photo container */}
      <Circle cx="150" cy="56" r="32" fill="rgba(0, 0, 0, 0.1)" stroke="rgba(0, 0, 0, 0.2)" strokeWidth="2" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="121"
          y="27"
          width="58"
          height="58"
          href={photoDataUri}
          clipPath="url(#photoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="56" r="29" fill="rgba(0, 0, 0, 0.15)" />
          <Text x="150" y="64" textAnchor="middle" fill="#78350f" fontSize="24" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Name */}
      <Text x="150" y="110" textAnchor="middle" fill="#1c1917" fontSize="16" fontWeight="700" fontFamily={FONT_FAMILY}>
        {(displayName || t("dedicated_patriot")).toUpperCase()}
      </Text>

      {/* Large count */}
      {stats && (
        <G>
          <Text x="150" y="185" textAnchor="middle" fill="#1c1917" fontSize="64" fontWeight="800" fontFamily={FONT_FAMILY}>
            {stats.completedCeremonies}
          </Text>
          <Text x="150" y="210" textAnchor="middle" fill="#57534e" fontSize="12" fontWeight="500" fontFamily={FONT_FAMILY}>
            {t("ceremonies")}
          </Text>
        </G>
      )}

      {/* Stats row */}
      {stats && (
        <G>
          <Text x="80" y="245" fontSize="10">🔥</Text>
          <Text x="92" y="245" fill="#44403c" fontSize="10" fontWeight="500" fontFamily={FONT_FAMILY}>
            {t("current_streak")}: {stats.currentStreak}
          </Text>
          <Text x="185" y="245" fontSize="10">⚡</Text>
          <Text x="197" y="245" fill="#44403c" fontSize="10" fontWeight="500" fontFamily={FONT_FAMILY}>
            {t("best_streak")}: {stats.longestStreak}
          </Text>
        </G>
      )}

      {/* Footer */}
      <Text x="125" y="280" fill="#78350f" fontSize="10" fontWeight="700" letterSpacing={2} fontFamily={FONT_FAMILY}>
        {t("badge_flag_ceremony")}
      </Text>
      <Text x="230" y="280" fontSize="12">🇻🇳</Text>
    </Svg>
  );
};
