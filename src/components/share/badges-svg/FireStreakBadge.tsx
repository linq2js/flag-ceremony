/**
 * FireStreakBadge SVG - Large streak with fire celebration
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

export const FireStreakBadge: React.FC<SVGBadgeProps> = ({
  photoDataUri,
  displayName,
  stats,
  t,
  width = 300,
  height = 300,
}) => {
  const initial = (displayName || "A").charAt(0).toUpperCase();

  // Generate fire positions around photo
  const fireCount = 8;
  const centerX = 150;
  const centerY = 60;
  const radius = 42;
  
  const firePositions = [...Array(fireCount)].map((_, i) => {
    const angle = (i * (360 / fireCount) * Math.PI) / 180 - Math.PI / 2;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });

  return (
    <Svg width={width} height={height} viewBox="0 0 300 300">
      <Defs>
        <LinearGradient id="fireBgGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#7f1d1d" />
          <Stop offset="0.5" stopColor="#5c1515" />
          <Stop offset="1" stopColor="#450a0a" />
        </LinearGradient>
        <ClipPath id="firePhotoClip">
          <Circle cx="150" cy="60" r="26" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="20" fill="url(#fireBgGradient)" />

      {/* Fire emojis around photo */}
      {firePositions.map((pos, i) => (
        <Text key={i} x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="14">
          🔥
        </Text>
      ))}

      {/* Photo container */}
      <Circle cx="150" cy="60" r="30" fill="rgba(255, 255, 255, 0.1)" stroke="#f97316" strokeWidth="3" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="124"
          y="34"
          width="52"
          height="52"
          href={photoDataUri}
          clipPath="url(#firePhotoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="60" r="26" fill="#f97316" />
          <Text x="150" y="68" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Name */}
      <Text 
        x="150" 
        y="120" 
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

      {/* Large streak */}
      <Text x="60" y="180" fontSize="24">🔥</Text>
      <Text x="150" y="185" textAnchor="middle" fill="#f97316" fontSize="52" fontWeight="900" fontFamily={FONT_FAMILY}>
        {stats?.currentStreak || 0}
      </Text>
      <Text x="228" y="180" fontSize="24">🔥</Text>

      {/* Streak label */}
      <Text x="150" y="210" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700" letterSpacing={2} fontFamily={FONT_FAMILY}>
        {t("badge_days_streak")}
      </Text>

      {/* Secondary stats */}
      {stats && (
        <G>
          <Text x="100" y="245" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="9" fontWeight="500" fontFamily={FONT_FAMILY}>
            🔥 {t("current_streak")}: {stats.currentStreak}
          </Text>
          <Text x="200" y="245" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="9" fontWeight="500" fontFamily={FONT_FAMILY}>
            ⚡ {t("best_streak")}: {stats.longestStreak}
          </Text>
        </G>
      )}

      {/* Footer */}
      <Text x="150" y="280" textAnchor="middle" fill="rgba(255, 255, 255, 0.5)" fontSize="10" fontWeight="700" letterSpacing={2} fontFamily={FONT_FAMILY}>
        {t("badge_flag_ceremony")} 🇻🇳
      </Text>
    </Svg>
  );
};
