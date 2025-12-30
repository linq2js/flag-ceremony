/**
 * Badge Store - Component-local store for badge customization
 *
 * Uses scoped() for component-local state that auto-disposes on unmount.
 * Manages badge design selection, user photo, name, and theme.
 */

import { store } from "storion/react";

// =============================================================================
// TYPES
// =============================================================================

export type BadgeType =
  | "simple-red"
  | "simple-orange"
  | "simple-navy"
  | "simple-olive"
  | "medal-ribbon"
  | "medal-clean"
  | "fire-ring"
  | "fire-streak"
  | "silhouette"
  | "trophy-banner"
  | "tier-achievement"
  | "military-stars"
  | "patriot-id"
  | "member-card"
  | "certificate-dedication"
  | "certificate-vn"
  | "certificate-recognition"
  | "ornate-gold"
  | "ornate-green"
  | "ranking-pattern";

export type BadgeTheme = "classic" | "sunrise" | "night" | "military";

export interface BadgeStats {
  /** Total ceremonies completed */
  totalCeremonies: number;
  /** Completed ceremonies count */
  completedCeremonies: number;
  /** Current streak in days */
  currentStreak: number;
  /** Longest streak ever achieved */
  longestStreak: number;
  /** User ranking percentile (if available) */
  percentile?: number;
  /** Member since date */
  memberSince?: Date;
}

// =============================================================================
// BADGE STORE
// =============================================================================

/**
 * Local store for badge customization.
 * Use with scoped() in useStore for component-local state.
 */
export const badgeStore = store({
  name: "badge",
  state: {
    /** Selected badge type */
    badgeType: "simple-red" as BadgeType,
    /** Selected theme */
    theme: "classic" as BadgeTheme,
    /** User's photo URI (from camera or gallery) */
    photoUri: null as string | null,
    /** User's display name */
    displayName: "",
    /** Whether to show total ceremonies */
    showTotal: true,
    /** Whether to show current streak */
    showCurrentStreak: true,
    /** Whether to show longest streak */
    showLongestStreak: true,
    /** Whether to show ranking */
    showRanking: true,
    /** Whether to show member since date */
    showMemberSince: false,
    /** Stats to display (populated from ceremony store) */
    stats: null as BadgeStats | null,
    /** Whether badge is being exported */
    isExporting: false,
  },
  setup({ state }) {
    return {
      setBadgeType: (type: BadgeType) => {
        state.badgeType = type;
      },
      setTheme: (theme: BadgeTheme) => {
        state.theme = theme;
      },
      setPhotoUri: (uri: string | null) => {
        state.photoUri = uri;
      },
      setDisplayName: (name: string) => {
        state.displayName = name;
      },
      toggleStat: (
        stat:
          | "showTotal"
          | "showCurrentStreak"
          | "showLongestStreak"
          | "showRanking"
          | "showMemberSince"
      ) => {
        state[stat] = !state[stat];
      },
      setStats: (stats: BadgeStats) => {
        state.stats = stats;
      },
      setExporting: (isExporting: boolean) => {
        state.isExporting = isExporting;
      },
      reset: () => {
        state.badgeType = "simple-red";
        state.theme = "classic";
        state.photoUri = null;
        state.displayName = "";
        state.showTotal = true;
        state.showCurrentStreak = true;
        state.showLongestStreak = true;
        state.showRanking = true;
        state.showMemberSince = false;
        state.isExporting = false;
      },
    };
  },
});

// =============================================================================
// THEME COLORS
// =============================================================================

export const BADGE_THEMES: Record<
  BadgeTheme,
  {
    name: string;
    background: string;
    backgroundGradient: string[];
    text: string;
    accent: string;
    border: string;
    secondary: string;
  }
> = {
  classic: {
    name: "Classic",
    background: "#1a0606",
    backgroundGradient: ["#2a0a0a", "#1a0606", "#0f0303"],
    text: "#ffffff",
    accent: "#fbbf24",
    border: "rgba(251, 191, 36, 0.3)",
    secondary: "rgba(255, 255, 255, 0.6)",
  },
  sunrise: {
    name: "Sunrise",
    background: "#fff7ed",
    backgroundGradient: ["#ffedd5", "#fed7aa", "#fdba74"],
    text: "#1c1917",
    accent: "#ea580c",
    border: "rgba(234, 88, 12, 0.3)",
    secondary: "rgba(28, 25, 23, 0.6)",
  },
  night: {
    name: "Night",
    background: "#0f172a",
    backgroundGradient: ["#1e293b", "#0f172a", "#020617"],
    text: "#f8fafc",
    accent: "#fbbf24",
    border: "rgba(251, 191, 36, 0.2)",
    secondary: "rgba(248, 250, 252, 0.5)",
  },
  military: {
    name: "Military",
    background: "#1c1917",
    backgroundGradient: ["#292524", "#1c1917", "#0c0a09"],
    text: "#fafaf9",
    accent: "#a3e635",
    border: "rgba(163, 230, 53, 0.3)",
    secondary: "rgba(250, 250, 249, 0.6)",
  },
};

// =============================================================================
// BADGE TYPE INFO
// =============================================================================

export const BADGE_TYPES: Record<
  BadgeType,
  {
    name: string;
    description: string;
    aspectRatio: number;
    width: number;
    height: number;
  }
> = {
  "simple-red": {
    name: "Simple Red",
    description: "Clean red card with photo and stats",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  "simple-orange": {
    name: "Simple Orange",
    description: "Warm orange minimalist card",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  "simple-navy": {
    name: "Simple Navy",
    description: "Dark blue elegant card",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  "simple-olive": {
    name: "Simple Olive",
    description: "Military olive tone card",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  "medal-ribbon": {
    name: "Medal Ribbon",
    description: "Gold medal with decorative ribbon",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  "medal-clean": {
    name: "Medal Clean",
    description: "Minimal medal badge design",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  "fire-ring": {
    name: "Fire Ring",
    description: "Flames surrounding photo",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  "fire-streak": {
    name: "Fire Streak",
    description: "Large streak with fire celebration",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  silhouette: {
    name: "Silhouette",
    description: "Ba Dinh Square silhouette design",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  "trophy-banner": {
    name: "Trophy Banner",
    description: "Flag banner with trophy icon",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  "tier-achievement": {
    name: "Tier Achievement",
    description: "Medal with Bronze/Silver/Gold tier",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  "military-stars": {
    name: "Military Stars",
    description: "Stars header military style",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  "patriot-id": {
    name: "Patriot ID",
    description: "ID card style certificate",
    aspectRatio: 16 / 10,
    width: 1600,
    height: 1000,
  },
  "member-card": {
    name: "Member Card",
    description: "Horizontal member info card",
    aspectRatio: 16 / 10,
    width: 1600,
    height: 1000,
  },
  "certificate-dedication": {
    name: "Certificate of Dedication",
    description: "Formal diploma certificate",
    aspectRatio: 4 / 3,
    width: 1600,
    height: 1200,
  },
  "certificate-vn": {
    name: "VN Certificate",
    description: "Vietnamese themed certificate",
    aspectRatio: 4 / 3,
    width: 1600,
    height: 1200,
  },
  "certificate-recognition": {
    name: "Recognition Certificate",
    description: "Certificate with ranking badge",
    aspectRatio: 4 / 3,
    width: 1600,
    height: 1200,
  },
  "ornate-gold": {
    name: "Ornate Gold",
    description: "Decorative gold border card",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  "ornate-green": {
    name: "Ornate Green",
    description: "Decorative military green card",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  "ranking-pattern": {
    name: "Ranking Pattern",
    description: "Top ranking with pattern background",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
};
