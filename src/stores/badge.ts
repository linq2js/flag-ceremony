/**
 * Badge Store - Component-local store for badge customization
 *
 * Uses scoped() for component-local state that auto-disposes on unmount.
 * Manages badge design selection, user photo, and name.
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
  | "medal-clean"
  | "fire-streak"
  | "silhouette"
  | "trophy-banner"
  | "military-stars"
  | "patriot-id"
  | "member-card"
  | "certificate-dedication"
  | "certificate-recognition"
  | "ranking-pattern";

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
  /** User's position on leaderboard (1 = first place) */
  rank?: number;
  /** Member since date */
  memberSince?: Date;
}

// =============================================================================
// CROP SETTINGS TYPE
// =============================================================================

export interface CropSettings {
  /** Slider value for zoom (0 = 1x scale) */
  sliderValue: number;
  /** Pan X offset */
  translateX: number;
  /** Pan Y offset */
  translateY: number;
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
    /** Original uploaded image URI (before cropping) */
    originalPhotoUri: null as string | null,
    /** Cropped photo URI (displayed in badge) */
    photoUri: null as string | null,
    /** Crop settings to persist between edits */
    cropSettings: null as CropSettings | null,
    /** User's display name */
    displayName: "",
    /** Whether badge is being exported */
    isExporting: false,
  },
  setup({ state }) {
    return {
      setBadgeType: (type: BadgeType) => {
        state.badgeType = type;
      },
      /** Set both original and cropped photo URIs with crop settings */
      setPhoto: (
        originalUri: string | null,
        croppedUri: string | null,
        cropSettings: CropSettings | null
      ) => {
        state.originalPhotoUri = originalUri;
        state.photoUri = croppedUri;
        state.cropSettings = cropSettings;
      },
      /** Update only the cropped URI and settings (for re-editing) */
      updateCrop: (croppedUri: string, cropSettings: CropSettings) => {
        state.photoUri = croppedUri;
        state.cropSettings = cropSettings;
      },
      /** Clear all photo data */
      clearPhoto: () => {
        state.originalPhotoUri = null;
        state.photoUri = null;
        state.cropSettings = null;
      },
      setDisplayName: (name: string) => {
        state.displayName = name;
      },
      setExporting: (isExporting: boolean) => {
        state.isExporting = isExporting;
      },
      reset: () => {
        state.badgeType = "simple-red";
        state.originalPhotoUri = null;
        state.photoUri = null;
        state.cropSettings = null;
        state.displayName = "";
        state.isExporting = false;
      },
    };
  },
});

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
  "medal-clean": {
    name: "Medal Clean",
    description: "Minimal medal badge design",
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
  "certificate-recognition": {
    name: "Recognition Certificate",
    description: "Certificate with ranking badge",
    aspectRatio: 4 / 3,
    width: 1600,
    height: 1200,
  },
  "ranking-pattern": {
    name: "Ranking Pattern",
    description: "Top ranking with pattern background",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
};
