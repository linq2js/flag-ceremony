/**
 * MemberCardBadge SVG - Horizontal member info card
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

export const MemberCardBadge: React.FC<SVGBadgeProps> = ({
  photoDataUri,
  displayName,
  stats,
  t,
  width = 340,
  height = 212,
}) => {
  const initial = (displayName || "A").charAt(0).toUpperCase();

  const formatDate = (date?: Date) => {
    if (!date) return "2023";
    return new Date(date).getFullYear().toString();
  };

  return (
    <Svg width={width} height={height} viewBox="0 0 340 212">
      <Defs>
        <LinearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#4d4d33" />
          <Stop offset="0.5" stopColor="#3d3d29" />
          <Stop offset="1" stopColor="#2d2d1f" />
        </LinearGradient>
        <ClipPath id="photoClip">
          <Circle cx="68" cy="80" r="25" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="340" height="212" rx="12" fill="url(#bgGradient)" />

      {/* Decorative border */}
      <Rect
        x="8"
        y="8"
        width="324"
        height="196"
        rx="8"
        fill="none"
        stroke="rgba(251, 191, 36, 0.4)"
        strokeWidth="1"
      />

      {/* Photo container */}
      <Circle cx="68" cy="80" r="28" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" strokeWidth="2" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="43"
          y="55"
          width="50"
          height="50"
          href={photoDataUri}
          clipPath="url(#photoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="68" cy="80" r="25" fill="rgba(251, 191, 36, 0.3)" />
          <Text x="68" y="88" textAnchor="middle" fill="#fbbf24" fontSize="20" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Name */}
      <Text x="68" y="130" textAnchor="middle" fill="#fafaf9" fontSize="12" fontWeight="700" fontFamily={FONT_FAMILY}>
        {(displayName || t("dedicated_patriot")).toUpperCase()}
      </Text>

      {/* Member since */}
      <Text x="68" y="145" textAnchor="middle" fill="rgba(250, 250, 249, 0.5)" fontSize="8" fontWeight="500" fontFamily={FONT_FAMILY}>
        Member since: {formatDate(stats?.memberSince)}
      </Text>

      {/* Handle */}
      <Text x="68" y="162" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600" fontFamily={FONT_FAMILY}>
        {displayName ? displayName.toUpperCase() : "PATRIOT"}
      </Text>

      {/* Right section - Stats */}
      {stats && (
        <G>
          <Text x="180" y="70" fill="rgba(250, 250, 249, 0.6)" fontSize="9" fontFamily={FONT_FAMILY}>
            🔥 {t("current_streak")}:
          </Text>
          <Text x="270" y="70" fill="#fafaf9" fontSize="10" fontWeight="600" fontFamily={FONT_FAMILY}>
            {stats.currentStreak} {t("days")}
          </Text>

          <Text x="180" y="95" fill="rgba(250, 250, 249, 0.6)" fontSize="9" fontFamily={FONT_FAMILY}>
            ⚡ {t("best_streak")}:
          </Text>
          <Text x="270" y="95" fill="#fafaf9" fontSize="10" fontWeight="600" fontFamily={FONT_FAMILY}>
            {stats.longestStreak}
          </Text>

          {stats?.percentile && (
            <G>
              <Rect
                x="180"
                y="110"
                width="80"
                height="22"
                rx="4"
                fill="rgba(251, 191, 36, 0.2)"
                stroke="#fbbf24"
                strokeWidth="1"
              />
              <Text x="220" y="125" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="700" fontFamily={FONT_FAMILY}>
                {t("badge_top")} {Math.ceil(100 - stats.percentile)}%
              </Text>
            </G>
          )}
        </G>
      )}
    </Svg>
  );
};
