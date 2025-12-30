/**
 * BadgePreviewSVG - Renders badges using SVG for stable image export
 * Uses react-native-svg for consistent rendering across platforms
 */

import React, { forwardRef, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Svg from "react-native-svg";
import { BadgeType, BadgeStats } from "../../stores/badge";
import { imageToDataUri, SVGBadgeProps, BADGE_TYPES } from "./badges-svg";

// SVG badge components
import { SimpleRedBadge } from "./badges-svg/SimpleRedBadge";
import { SimpleOrangeBadge } from "./badges-svg/SimpleOrangeBadge";
import { SimpleNavyBadge } from "./badges-svg/SimpleNavyBadge";
import { SimpleOliveBadge } from "./badges-svg/SimpleOliveBadge";
import { MedalCleanBadge } from "./badges-svg/MedalCleanBadge";
import { FireStreakBadge } from "./badges-svg/FireStreakBadge";
import { SilhouetteBadge } from "./badges-svg/SilhouetteBadge";
import { TrophyBannerBadge } from "./badges-svg/TrophyBannerBadge";
import { MilitaryStarsBadge } from "./badges-svg/MilitaryStarsBadge";
import { PatriotIDBadge } from "./badges-svg/PatriotIDBadge";
import { MemberCardBadge } from "./badges-svg/MemberCardBadge";
import { CertificateDedicationBadge } from "./badges-svg/CertificateDedicationBadge";
import { CertificateRecognitionBadge } from "./badges-svg/CertificateRecognitionBadge";
import { RankingPatternBadge } from "./badges-svg/RankingPatternBadge";

interface BadgePreviewSVGProps {
  badgeType: BadgeType;
  photoUri: string | null;
  displayName: string;
  stats: BadgeStats | null;
  t: (key: string, params?: Record<string, unknown>) => string;
  /** Scale factor for preview (1 = full export size) */
  previewScale?: number;
  /** Called when SVG ref is available for export */
  onSvgRef?: (ref: Svg | null) => void;
}

// Badge component map for easier lookup
const BADGE_COMPONENTS: Record<string, React.FC<SVGBadgeProps>> = {
  "simple-red": SimpleRedBadge,
  "simple-orange": SimpleOrangeBadge,
  "simple-navy": SimpleNavyBadge,
  "simple-olive": SimpleOliveBadge,
  "medal-clean": MedalCleanBadge,
  "fire-streak": FireStreakBadge,
  silhouette: SilhouetteBadge,
  "trophy-banner": TrophyBannerBadge,
  "military-stars": MilitaryStarsBadge,
  "patriot-id": PatriotIDBadge,
  "member-card": MemberCardBadge,
  "certificate-dedication": CertificateDedicationBadge,
  "certificate-recognition": CertificateRecognitionBadge,
  "ranking-pattern": RankingPatternBadge,
};

export const BadgePreviewSVG = forwardRef<Svg, BadgePreviewSVGProps>(
  (
    {
      badgeType,
      photoUri,
      displayName,
      stats,
      t,
      previewScale = 1,
      onSvgRef,
    },
    ref
  ) => {
    const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);

    // Convert photo to data URI for SVG embedding
    useEffect(() => {
      let mounted = true;
      if (photoUri) {
        imageToDataUri(photoUri).then((dataUri) => {
          if (mounted) setPhotoDataUri(dataUri);
        });
      } else {
        setPhotoDataUri(null);
      }
      return () => {
        mounted = false;
      };
    }, [photoUri]);

    // Get badge dimensions
    const badgeInfo = BADGE_TYPES[badgeType as keyof typeof BADGE_TYPES] || BADGE_TYPES["simple-red"];
    const width = badgeInfo.width * previewScale;
    const height = badgeInfo.height * previewScale;

    // Get the badge component
    const BadgeComponent = BADGE_COMPONENTS[badgeType] || SimpleRedBadge;

    return (
      <View style={[styles.container, { width, height }]} collapsable={false}>
        <BadgeComponent
          photoDataUri={photoDataUri}
          displayName={displayName}
          stats={stats}
          t={t}
          width={width}
          height={height}
        />
      </View>
    );
  }
);

BadgePreviewSVG.displayName = "BadgePreviewSVG";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

/**
 * Get badge dimensions for a given type
 */
export function getBadgeDimensions(badgeType: BadgeType): { width: number; height: number } {
  const info = BADGE_TYPES[badgeType as keyof typeof BADGE_TYPES] || BADGE_TYPES["simple-red"];
  return { width: info.width, height: info.height };
}

