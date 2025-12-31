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
        <LinearGradient id="orangeBgGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#fef3c7" />
          <Stop offset="0.5" stopColor="#fcd34d" />
          <Stop offset="1" stopColor="#f59e0b" />
        </LinearGradient>
        <ClipPath id="orangePhotoClip">
          <Circle cx="150" cy="70" r="50" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="20" fill="url(#orangeBgGradient)" />

      {/* Photo container - 70% larger */}
      <Circle cx="150" cy="70" r="54" fill="rgba(0, 0, 0, 0.1)" stroke="rgba(0, 0, 0, 0.2)" strokeWidth="2" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="100"
          y="20"
          width="100"
          height="100"
          href={photoDataUri}
          clipPath="url(#orangePhotoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="70" r="50" fill="rgba(0, 0, 0, 0.15)" />
          <Text x="150" y="82" textAnchor="middle" fill="#78350f" fontSize="40" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Name - 50% larger font */}
      <Text 
        x="150" 
        y="150" 
        textAnchor="middle" 
        fill="#1c1917" 
        fontSize="24" 
        fontWeight="700" 
        fontFamily={FONT_FAMILY}
      >
        {((displayName || t("dedicated_patriot")).length > 20 
          ? (displayName || t("dedicated_patriot")).substring(0, 20) + "..." 
          : (displayName || t("dedicated_patriot"))).toUpperCase()}
      </Text>

      {/* Large count */}
      {stats && (
        <G>
          <Text x="150" y="210" textAnchor="middle" fill="#1c1917" fontSize="64" fontWeight="800" fontFamily={FONT_FAMILY}>
            {stats.completedCeremonies}
          </Text>
          <Text x="150" y="232" textAnchor="middle" fill="#57534e" fontSize="18" fontWeight="500" fontFamily={FONT_FAMILY}>
            {t("ceremonies")}
          </Text>
        </G>
      )}

      {/* Stats row - 50% larger font */}
      {stats && (
        <Text x="150" y="262" textAnchor="middle" fill="#44403c" fontSize="15" fontWeight="500" fontFamily={FONT_FAMILY}>
          🔥 {t("current_streak")}: {stats.currentStreak}  ⚡ {t("best_streak")}: {stats.longestStreak}
        </Text>
      )}

      {/* Footer - 50% larger font */}
      <Text x="150" y="288" textAnchor="middle" fill="#78350f" fontSize="15" fontWeight="700" letterSpacing={2} fontFamily={FONT_FAMILY}>
        {t("badge_flag_ceremony")} 🇻🇳
      </Text>
    </Svg>
  );
};
