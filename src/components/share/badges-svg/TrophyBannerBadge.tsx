/**
 * TrophyBannerBadge SVG - Trophy with banner design
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
        <LinearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#1e3a5f" />
          <Stop offset="0.5" stopColor="#0f172a" />
          <Stop offset="1" stopColor="#020617" />
        </LinearGradient>
        <ClipPath id="photoClip">
          <Circle cx="150" cy="70" r="28" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="20" fill="url(#bgGradient)" />

      {/* Trophy icon */}
      <Text x="150" y="30" textAnchor="middle" fontSize="20">🏆</Text>

      {/* Photo container */}
      <Circle cx="150" cy="70" r="32" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" strokeWidth="2" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="122"
          y="42"
          width="56"
          height="56"
          href={photoDataUri}
          clipPath="url(#photoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="70" r="28" fill="rgba(251, 191, 36, 0.3)" />
          <Text x="150" y="78" textAnchor="middle" fill="#fbbf24" fontSize="22" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Name */}
      <Text 
        x="150" 
        y="125" 
        textAnchor="middle" 
        fill="#ffffff" 
        fontSize="14" 
        fontWeight="700" 
        fontFamily={FONT_FAMILY}
      >
        {((displayName || t("dedicated_patriot")).length > 20 
          ? (displayName || t("dedicated_patriot")).substring(0, 20) + "..." 
          : (displayName || t("dedicated_patriot"))).toUpperCase()}
      </Text>

      {/* Count */}
      {stats && (
        <G>
          <Text x="150" y="185" textAnchor="middle" fill="#ffffff" fontSize="42" fontWeight="800" fontFamily={FONT_FAMILY}>
            {stats.completedCeremonies}
          </Text>
          <Text x="150" y="208" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600" letterSpacing={2} fontFamily={FONT_FAMILY}>
            {t("ceremonies").toUpperCase()}
          </Text>
        </G>
      )}

      {/* Stats */}
      {stats && (
        <Text x="150" y="245" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="10" fontWeight="500" fontFamily={FONT_FAMILY}>
          {stats.currentStreak} {t("days")} | {stats.longestStreak}X {t("days")}
        </Text>
      )}

      {/* Footer */}
      <Text x="150" y="280" textAnchor="middle" fill="rgba(255, 255, 255, 0.5)" fontSize="10" fontWeight="700" letterSpacing={2} fontFamily={FONT_FAMILY}>
        {t("badge_flag_ceremony")} 🇻🇳
      </Text>
    </Svg>
  );
};
