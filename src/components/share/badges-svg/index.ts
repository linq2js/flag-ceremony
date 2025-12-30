/**
 * SVG Badge Components Index - 14 unique badge designs
 */

export * from "./types";
export * from "./utils";

// Simple badges (4)
export { SimpleRedBadge } from "./SimpleRedBadge";
export { SimpleOrangeBadge } from "./SimpleOrangeBadge";
export { SimpleNavyBadge } from "./SimpleNavyBadge";
export { SimpleOliveBadge } from "./SimpleOliveBadge";

// Medal badges (1)
export { MedalCleanBadge } from "./MedalCleanBadge";

// Fire badges (1)
export { FireStreakBadge } from "./FireStreakBadge";

// Special badges (2)
export { SilhouetteBadge } from "./SilhouetteBadge";
export { TrophyBannerBadge } from "./TrophyBannerBadge";

// Achievement badges (1)
export { MilitaryStarsBadge } from "./MilitaryStarsBadge";

// ID cards (2)
export { PatriotIDBadge } from "./PatriotIDBadge";
export { MemberCardBadge } from "./MemberCardBadge";

// Certificates (2)
export { CertificateDedicationBadge } from "./CertificateDedicationBadge";
export { CertificateRecognitionBadge } from "./CertificateRecognitionBadge";

// Ranking badges (1)
export { RankingPatternBadge } from "./RankingPatternBadge";

// Badge type registry with dimensions
export const BADGE_TYPES = {
  "simple-red": { component: "SimpleRedBadge", width: 300, height: 300 },
  "simple-orange": { component: "SimpleOrangeBadge", width: 300, height: 300 },
  "simple-navy": { component: "SimpleNavyBadge", width: 300, height: 300 },
  "simple-olive": { component: "SimpleOliveBadge", width: 300, height: 300 },
  "medal-clean": { component: "MedalCleanBadge", width: 300, height: 300 },
  "fire-streak": { component: "FireStreakBadge", width: 300, height: 300 },
  silhouette: { component: "SilhouetteBadge", width: 300, height: 300 },
  "trophy-banner": { component: "TrophyBannerBadge", width: 300, height: 300 },
  "military-stars": { component: "MilitaryStarsBadge", width: 300, height: 300 },
  "patriot-id": { component: "PatriotIDBadge", width: 340, height: 212 },
  "member-card": { component: "MemberCardBadge", width: 340, height: 212 },
  "certificate-dedication": { component: "CertificateDedicationBadge", width: 360, height: 270 },
  "certificate-recognition": { component: "CertificateRecognitionBadge", width: 360, height: 270 },
  "ranking-pattern": { component: "RankingPatternBadge", width: 300, height: 300 },
} as const;

export type BadgeTypeKey = keyof typeof BADGE_TYPES;

