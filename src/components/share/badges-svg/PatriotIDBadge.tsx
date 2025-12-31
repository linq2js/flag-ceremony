/**
 * PatriotIDBadge SVG - ID card style certificate
 */

import React from "react";
import Svg, {
  Rect,
  Text,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
  Image,
  G,
  Line,
} from "react-native-svg";
import { SVGBadgeProps, FONT_FAMILY } from "./types";

export const PatriotIDBadge: React.FC<SVGBadgeProps> = ({
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
        <LinearGradient id="patriotLeftPanel" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#3d2d2d" />
          <Stop offset="0.5" stopColor="#2d1f1f" />
          <Stop offset="1" stopColor="#1d1515" />
        </LinearGradient>
        <LinearGradient id="patriotRightPanel" x1="0.4" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#5c4040" />
          <Stop offset="0.5" stopColor="#4d3535" />
          <Stop offset="1" stopColor="#3d2a2a" />
        </LinearGradient>
        <ClipPath id="patriotPhotoClip">
          <Rect x="36" y="52" width="64" height="76" rx="4" />
        </ClipPath>
      </Defs>

      {/* Right panel (background) */}
      <Rect x="0" y="0" width="340" height="212" rx="12" fill="url(#patriotRightPanel)" />

      {/* Left dark panel */}
      <Rect x="0" y="0" width="130" height="212" rx="12" fill="url(#patriotLeftPanel)" />
      <Rect x="12" y="0" width="118" height="212" fill="url(#patriotLeftPanel)" />

      {/* Header */}
      <Text x="170" y="20" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="700" letterSpacing={2} fontFamily={FONT_FAMILY}>
        {t("badge_patriot_certificate")}
      </Text>
      <Line x1="20" y1="28" x2="320" y2="28" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="1" />

      {/* Photo container */}
      <Rect x="33" y="49" width="70" height="82" rx="6" fill="rgba(0, 0, 0, 0.3)" stroke="#fbbf24" strokeWidth="2" />

      {/* Photo or initial */}
      {photoDataUri ? (
        <Image
          x="36"
          y="52"
          width="64"
          height="76"
          href={photoDataUri}
          clipPath="url(#patriotPhotoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <G>
          <Rect x="36" y="52" width="64" height="76" rx="4" fill="rgba(251, 191, 36, 0.2)" />
          <Text x="68" y="100" textAnchor="middle" fill="#fbbf24" fontSize="28" fontWeight="700" fontFamily={FONT_FAMILY}>
            {initial}
          </Text>
        </G>
      )}

      {/* Right section - Info */}
      <Text 
        x="150" 
        y="60" 
        textAnchor="start"
        fill="#ffffff" 
        fontSize="14" 
        fontWeight="700" 
        fontFamily={FONT_FAMILY}
      >
        {((displayName || t("dedicated_patriot")).length > 20 
          ? (displayName || t("dedicated_patriot")).substring(0, 20) + "..." 
          : (displayName || t("dedicated_patriot")))}
      </Text>

      {/* Member since */}
      <Text x="150" y="78" fill="rgba(255, 255, 255, 0.6)" fontSize="9" fontWeight="500" fontFamily={FONT_FAMILY}>
        {t("member_since")}: {formatDate(stats?.memberSince)}
      </Text>

      {/* Stats */}
      {stats && (
        <G>
          <Text x="150" y="105" fontSize="12">🏆</Text>
          <Text x="168" y="105" fill="#ffffff" fontSize="12" fontWeight="700" fontFamily={FONT_FAMILY}>
            {stats.completedCeremonies}
          </Text>
          <Text x="195" y="105" fill="rgba(255, 255, 255, 0.7)" fontSize="10" fontFamily={FONT_FAMILY}>
            {t("ceremonies").toUpperCase()}
          </Text>

          <Text x="150" y="125" fontSize="12">🔥</Text>
          <Text x="168" y="125" fill="rgba(255, 255, 255, 0.7)" fontSize="10" fontFamily={FONT_FAMILY}>
            {t("current_streak")}:
          </Text>
          <Text x="245" y="125" fill="#ffffff" fontSize="10" fontWeight="700" fontFamily={FONT_FAMILY}>
            {stats.currentStreak}
          </Text>

          <Text x="150" y="145" fontSize="12">⚡</Text>
          <Text x="168" y="145" fill="rgba(255, 255, 255, 0.7)" fontSize="10" fontFamily={FONT_FAMILY}>
            {t("longest_streak")}:
          </Text>
          <Text x="245" y="145" fill="#ffffff" fontSize="10" fontWeight="700" fontFamily={FONT_FAMILY}>
            {stats.longestStreak}
          </Text>
        </G>
      )}

      {/* Footer */}
      <Line x1="20" y1="192" x2="320" y2="192" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="1" />
      <Text x="20" y="205" fill="rgba(255, 255, 255, 0.5)" fontSize="8" fontWeight="500" fontFamily={FONT_FAMILY}>
        ID: 00012345
      </Text>
      <Text x="320" y="205" textAnchor="end" fill="rgba(255, 255, 255, 0.5)" fontSize="8" fontWeight="500" fontFamily={FONT_FAMILY}>
        www.flag-ceremony.app
      </Text>
    </Svg>
  );
};
