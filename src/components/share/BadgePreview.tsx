/**
 * BadgePreview - Renders the selected badge type with current settings
 * Supports 20 unique badge designs
 */

import React, { forwardRef } from "react";
import { View, StyleSheet } from "react-native";
import { BadgeType, BadgeTheme, BadgeStats } from "../../stores/badge";

// Simple badges
import { SimpleRedBadge } from "./badges/SimpleRedBadge";
import { SimpleOrangeBadge } from "./badges/SimpleOrangeBadge";
import { SimpleNavyBadge } from "./badges/SimpleNavyBadge";
import { SimpleOliveBadge } from "./badges/SimpleOliveBadge";

// Medal badges
import { MedalRibbonBadge } from "./badges/MedalRibbonBadge";
import { MedalCleanBadge } from "./badges/MedalCleanBadge";

// Fire badges
import { FireRingBadge } from "./badges/FireRingBadge";
import { FireStreakBadge } from "./badges/FireStreakBadge";

// Special badges
import { SilhouetteBadge } from "./badges/SilhouetteBadge";
import { TrophyBannerBadge } from "./badges/TrophyBannerBadge";

// Achievement badges
import { TierAchievementBadge } from "./badges/TierAchievementBadge";
import { MilitaryStarsBadge } from "./badges/MilitaryStarsBadge";

// ID cards
import { PatriotIDBadge } from "./badges/PatriotIDBadge";
import { MemberCardBadge } from "./badges/MemberCardBadge";

// Certificates
import { CertificateDedicationBadge } from "./badges/CertificateDedicationBadge";
import { CertificateVNBadge } from "./badges/CertificateVNBadge";
import { CertificateRecognitionBadge } from "./badges/CertificateRecognitionBadge";

// Ornate badges
import { OrnateGoldBadge } from "./badges/OrnateGoldBadge";
import { OrnateGreenBadge } from "./badges/OrnateGreenBadge";
import { RankingPatternBadge } from "./badges/RankingPatternBadge";

interface BadgePreviewProps {
  badgeType: BadgeType;
  theme: BadgeTheme;
  photoUri: string | null;
  displayName: string;
  stats: BadgeStats | null;
  showTotal: boolean;
  showCurrentStreak: boolean;
  showLongestStreak: boolean;
  showRanking: boolean;
  showMemberSince: boolean;
  t: (key: string, params?: Record<string, unknown>) => string;
  previewScale?: number;
}

export const BadgePreview = forwardRef<View, BadgePreviewProps>(
  (
    {
      badgeType,
      theme,
      photoUri,
      displayName,
      stats,
      showTotal,
      showCurrentStreak,
      showLongestStreak,
      showRanking,
      showMemberSince,
      t,
      previewScale = 1,
    },
    ref
  ) => {
    const badgeProps = {
      photoUri,
      displayName,
      theme,
      stats,
      showTotal,
      showCurrentStreak,
      showLongestStreak,
      showRanking,
      showMemberSince,
      t,
      scale: previewScale,
    };

    const renderBadge = () => {
      switch (badgeType) {
        // Simple badges
        case "simple-red":
          return <SimpleRedBadge {...badgeProps} />;
        case "simple-orange":
          return <SimpleOrangeBadge {...badgeProps} />;
        case "simple-navy":
          return <SimpleNavyBadge {...badgeProps} />;
        case "simple-olive":
          return <SimpleOliveBadge {...badgeProps} />;

        // Medal badges
        case "medal-ribbon":
          return <MedalRibbonBadge {...badgeProps} />;
        case "medal-clean":
          return <MedalCleanBadge {...badgeProps} />;

        // Fire badges
        case "fire-ring":
          return <FireRingBadge {...badgeProps} />;
        case "fire-streak":
          return <FireStreakBadge {...badgeProps} />;

        // Special badges
        case "silhouette":
          return <SilhouetteBadge {...badgeProps} />;
        case "trophy-banner":
          return <TrophyBannerBadge {...badgeProps} />;

        // Achievement badges
        case "tier-achievement":
          return <TierAchievementBadge {...badgeProps} />;
        case "military-stars":
          return <MilitaryStarsBadge {...badgeProps} />;

        // ID cards
        case "patriot-id":
          return <PatriotIDBadge {...badgeProps} />;
        case "member-card":
          return <MemberCardBadge {...badgeProps} />;

        // Certificates
        case "certificate-dedication":
          return <CertificateDedicationBadge {...badgeProps} />;
        case "certificate-vn":
          return <CertificateVNBadge {...badgeProps} />;
        case "certificate-recognition":
          return <CertificateRecognitionBadge {...badgeProps} />;

        // Ornate badges
        case "ornate-gold":
          return <OrnateGoldBadge {...badgeProps} />;
        case "ornate-green":
          return <OrnateGreenBadge {...badgeProps} />;
        case "ranking-pattern":
          return <RankingPatternBadge {...badgeProps} />;

        default:
          return <SimpleRedBadge {...badgeProps} />;
      }
    };

    return (
      <View ref={ref} style={styles.container} collapsable={false}>
        {renderBadge()}
      </View>
    );
  }
);

BadgePreview.displayName = "BadgePreview";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
