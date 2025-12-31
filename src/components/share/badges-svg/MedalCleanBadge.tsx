/**
 * MedalCleanBadge SVG - Minimal medal badge design
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

export const MedalCleanBadge: React.FC<SVGBadgeProps> = ({
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
        <LinearGradient id="medalBgGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#7f1d1d" />
          <Stop offset="0.5" stopColor="#5c1515" />
          <Stop offset="1" stopColor="#450a0a" />
        </LinearGradient>
        <ClipPath id="medalPhotoClip">
          <Circle cx="150" cy="85" r="29" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="20" fill="url(#medalBgGradient)" />

      {/* Medal icon */}
      <Circle cx="150" cy="35" r="20" fill="rgba(251, 191, 36, 0.2)" />
      <Text x="150" y="43" textAnchor="middle" fontSize="20">🏅</Text>

      {/* Photo container */}
      <Circle cx="150" cy="85" r="32" fill="rgba(255, 255, 255, 0.1)" stroke="#fbbf24" strokeWidth="2" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="121"
          y="56"
          width="58"
          height="58"
          href={photoDataUri}
          clipPath="url(#medalPhotoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="85" r="29" fill="rgba(251, 191, 36, 0.3)" />
          <Text x="150" y="93" textAnchor="middle" fill="#fbbf24" fontSize="24" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Name */}
      <Text x="150" y="138" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700" fontFamily={FONT_FAMILY}>
        {(displayName || t("dedicated_patriot")).toUpperCase()}
      </Text>

      {/* Large count */}
      {stats && (
        <G>
          <Text x="150" y="205" textAnchor="middle" fill="#ffffff" fontSize="56" fontWeight="800" fontFamily={FONT_FAMILY}>
            {stats.completedCeremonies}
          </Text>
          <Text x="150" y="228" textAnchor="middle" fill="rgba(255, 255, 255, 0.7)" fontSize="12" fontWeight="500" fontFamily={FONT_FAMILY}>
            {t("ceremonies")}
          </Text>
        </G>
      )}

      {/* Stats */}
      {stats && (
        <G>
          <Text x="150" y="252" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="9" fontWeight="500" fontFamily={FONT_FAMILY}>
            🔥 {t("current_streak")}: {stats.currentStreak}
          </Text>
          <Text x="150" y="266" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="9" fontWeight="500" fontFamily={FONT_FAMILY}>
            ⚡ {t("best_streak")}: {stats.longestStreak}
          </Text>
        </G>
      )}

      {/* Footer */}
      <Text x="150" y="290" textAnchor="middle" fill="rgba(255, 255, 255, 0.5)" fontSize="10" fontWeight="700" letterSpacing={2} fontFamily={FONT_FAMILY}>
        {t("badge_flag_ceremony")} 🇻🇳
      </Text>
    </Svg>
  );
};
