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
    if (!date) return t("badge_new_member") || "New Member";
    return new Date(date).getFullYear().toString();
  };

  return (
    <Svg width={width} height={height} viewBox="0 0 340 212">
      <Defs>
        <LinearGradient id="memberBgGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#4d4d33" />
          <Stop offset="0.5" stopColor="#3d3d29" />
          <Stop offset="1" stopColor="#2d2d1f" />
        </LinearGradient>
        <ClipPath id="memberPhotoClip">
          <Circle cx="68" cy="70" r="38" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect
        x="0"
        y="0"
        width="340"
        height="212"
        rx="12"
        fill="url(#memberBgGradient)"
      />

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

      {/* Photo container - 50% larger */}
      <Circle
        cx="68"
        cy="70"
        r="42"
        fill="rgba(251, 191, 36, 0.2)"
        stroke="#fbbf24"
        strokeWidth="2"
      />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="30"
          y="32"
          width="76"
          height="76"
          href={photoDataUri}
          clipPath="url(#memberPhotoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="68" cy="70" r="38" fill="rgba(251, 191, 36, 0.3)" />
          <Text
            x="68"
            y="82"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="30"
            fontWeight="700"
            fontFamily={FONT_FAMILY}
          >
            {initial}
          </Text>
        </G>
      )}

      {/* Name */}
      <Text
        x="68"
        y="135"
        textAnchor="middle"
        fill="#fafaf9"
        fontSize="12"
        fontWeight="700"
        fontFamily={FONT_FAMILY}
      >
        {((displayName || t("dedicated_patriot")).length > 15
          ? (displayName || t("dedicated_patriot")).substring(0, 15) + "..."
          : displayName || t("dedicated_patriot")
        ).toUpperCase()}
      </Text>

      {/* Member since */}
      <Text
        x="68"
        y="152"
        textAnchor="middle"
        fill="rgba(250, 250, 249, 0.5)"
        fontSize="8"
        fontWeight="500"
        fontFamily={FONT_FAMILY}
      >
        Member since: {formatDate(stats?.memberSince)}
      </Text>

      {/* Handle */}
      <Text
        x="68"
        y="170"
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="10"
        fontWeight="600"
        fontFamily={FONT_FAMILY}
      >
        {displayName ? displayName.toUpperCase() : "PATRIOT"}
      </Text>

      {/* Right section - Stats (+50% font size) */}
      {stats && (
        <G>
          <Text
            x="175"
            y="65"
            fill="rgba(250, 250, 249, 0.6)"
            fontSize="14"
            fontFamily={FONT_FAMILY}
          >
            🔥 {t("current_streak")}:
          </Text>
          <Text
            x="290"
            y="65"
            fill="#fafaf9"
            fontSize="15"
            fontWeight="600"
            fontFamily={FONT_FAMILY}
          >
            &nbsp;{stats.currentStreak}
          </Text>

          <Text
            x="175"
            y="95"
            fill="rgba(250, 250, 249, 0.6)"
            fontSize="14"
            fontFamily={FONT_FAMILY}
          >
            ⚡ {t("best_streak")}:
          </Text>
          <Text
            x="290"
            y="95"
            fill="#fafaf9"
            fontSize="15"
            fontWeight="600"
            fontFamily={FONT_FAMILY}
          >
            &nbsp;{stats.longestStreak}
          </Text>

          {stats?.percentile && (
            <G>
              <Rect
                x="175"
                y="115"
                width="100"
                height="28"
                rx="6"
                fill="rgba(251, 191, 36, 0.2)"
                stroke="#fbbf24"
                strokeWidth="1"
              />
              <Text
                x="225"
                y="134"
                textAnchor="middle"
                fill="#fbbf24"
                fontSize="14"
                fontWeight="700"
                fontFamily={FONT_FAMILY}
              >
                {t("badge_top")} {Math.ceil(100 - stats.percentile)}%
              </Text>
            </G>
          )}
        </G>
      )}
    </Svg>
  );
};
