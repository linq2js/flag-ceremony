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
        <LinearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#3d3d29" />
          <Stop offset="0.5" stopColor="#2d2d1f" />
          <Stop offset="1" stopColor="#1d1d15" />
        </LinearGradient>
        <ClipPath id="photoClip">
          <Circle cx="150" cy="95" r="27" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="16" fill="url(#bgGradient)" />

      {/* Decorative border */}
      <Rect x="8" y="8" width="284" height="284" rx="12" fill="none" stroke="#fbbf24" strokeWidth="2" />

      {/* Header */}
      <Text x="115" y="30" fontSize="10">🇻🇳</Text>
      <Text x="150" y="30" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="700" letterSpacing={1} fontFamily={FONT_FAMILY}>
        {t("badge_flag_ceremony")}
      </Text>
      <Text x="183" y="30" fontSize="10">🇻🇳</Text>

      {/* Stars row */}
      <Text x="130" y="55" fontSize="14">⭐</Text>
      <Text x="145" y="55" fontSize="16">⭐</Text>
      <Text x="162" y="55" fontSize="14">⭐</Text>

      {/* Photo container */}
      <Circle cx="150" cy="95" r="30" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" strokeWidth="2" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="123"
          y="68"
          width="54"
          height="54"
          href={photoDataUri}
          clipPath="url(#photoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="95" r="27" fill="rgba(251, 191, 36, 0.3)" />
          <Text x="150" y="103" textAnchor="middle" fill="#fbbf24" fontSize="22" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Name */}
      <Text x="150" y="145" textAnchor="middle" fill="#fafaf9" fontSize="12" fontWeight="700" fontFamily={FONT_FAMILY}>
        {(displayName || t("dedicated_patriot")).toUpperCase()}
      </Text>

      {/* Description */}
      <Text x="150" y="162" textAnchor="middle" fill="rgba(250, 250, 249, 0.5)" fontSize="8" fontStyle="italic" fontFamily={FONT_FAMILY}>
        This commemorates that
      </Text>

      {/* Stats */}
      {stats && (
        <G>
          <Text x="150" y="185" textAnchor="middle" fill="rgba(250, 250, 249, 0.8)" fontSize="9" fontFamily={FONT_FAMILY}>
            🔥 {t("current_streak")}: {stats.currentStreak} {t("days")}
          </Text>
          <Text x="150" y="200" textAnchor="middle" fill="rgba(250, 250, 249, 0.8)" fontSize="9" fontFamily={FONT_FAMILY}>
            ⚡ {t("longest_streak")}: {stats.longestStreak} {t("days")}
          </Text>
          {stats?.percentile && (
            <Text x="150" y="215" textAnchor="middle" fill="rgba(250, 250, 249, 0.8)" fontSize="9" fontFamily={FONT_FAMILY}>
              👑 {t("badge_top")} {Math.ceil(100 - stats.percentile)}%
            </Text>
          )}
        </G>
      )}

      {/* Action button */}
      <Rect x="115" y="235" width="70" height="22" rx="4" fill="#fbbf24" />
      <Text x="150" y="250" textAnchor="middle" fill="#1c1917" fontSize="8" fontWeight="700" letterSpacing={1} fontFamily={FONT_FAMILY}>
        GO CEREMONY
      </Text>
    </Svg>
  );
};
