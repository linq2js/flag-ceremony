/**
 * SilhouetteBadge SVG - Ba Dinh Square silhouette design
 * Dark gradient background with mausoleum silhouette
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

export const SilhouetteBadge: React.FC<SVGBadgeProps> = ({
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
        <LinearGradient id="silhouetteBgGradient" x1="0.5" y1="0" x2="0.5" y2="1">
          <Stop offset="0" stopColor="#1a1a1a" />
          <Stop offset="0.5" stopColor="#0f0f0f" />
          <Stop offset="1" stopColor="#050505" />
        </LinearGradient>
        <ClipPath id="silhouettePhotoClip">
          <Circle cx="150" cy="65" r="36" />
        </ClipPath>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="300" height="300" rx="16" fill="url(#silhouetteBgGradient)" />

      {/* Ba Dinh Silhouette at bottom */}
      <G>
        {/* Mausoleum */}
        <Rect x="100" y="250" width="100" height="50" fill="#2d1f1f" />
        <Path d="M90 250 L150 230 L210 250 Z" fill="#2d1f1f" />
        {/* Columns */}
        <Rect x="110" y="255" width="8" height="40" fill="#1a1212" />
        <Rect x="130" y="255" width="8" height="40" fill="#1a1212" />
        <Rect x="150" y="255" width="8" height="40" fill="#1a1212" />
        <Rect x="170" y="255" width="8" height="40" fill="#1a1212" />
        <Rect x="182" y="255" width="8" height="40" fill="#1a1212" />
        {/* Side buildings */}
        <Rect x="20" y="270" width="60" height="30" fill="#1a1212" />
        <Rect x="220" y="270" width="60" height="30" fill="#1a1212" />
      </G>

      {/* Photo container with gold ring */}
      <Circle cx="150" cy="65" r="40" fill="#fbbf24" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="114"
          y="29"
          width="72"
          height="72"
          href={photoDataUri}
          clipPath="url(#silhouettePhotoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Circle cx="150" cy="65" r="36" fill="#92400e" />
          <Text x="150" y="75" textAnchor="middle" fill="#fef3c7" fontSize="28" fontWeight="800" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Count */}
      {stats && (
        <G>
          <Text x="150" y="145" textAnchor="middle" fill="#fbbf24" fontSize="48" fontWeight="800" fontFamily={FONT_FAMILY}>
            {stats.completedCeremonies}
          </Text>
          <Text x="150" y="168" textAnchor="middle" fill="rgba(255, 255, 255, 0.7)" fontSize="11" fontWeight="500" fontFamily={FONT_FAMILY}>
            {t("ceremonies")}
          </Text>
        </G>
      )}

      {/* Stats - two lines */}
      {stats && (
        <G>
          <Text x="150" y="195" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="13" fontWeight="500" fontFamily={FONT_FAMILY}>
            {t("current_streak")}: {stats.currentStreak} {t("days")}
          </Text>
          <Text x="150" y="215" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="13" fontWeight="500" fontFamily={FONT_FAMILY}>
            {t("cool_streak")}: {stats.longestStreak} {t("days")}
          </Text>
        </G>
      )}
    </Svg>
  );
};
