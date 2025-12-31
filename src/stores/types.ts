/**
 * Store Types - Shared types for all stores
 */
import type { SyncPayload, VerifiedStats } from "@/services/types";
import type { Language } from "../i18n";

// =============================================================================
// CEREMONY
// =============================================================================

export interface CeremonyLog {
  id: string;
  date: string; // ISO string (YYYY-MM-DD)
  completedAt: string; // ISO string with time
  duration: number; // in seconds
  completed: boolean; // true if ceremony was fully completed
}

export interface CeremonyState {
  /** All ceremony logs (completed and incomplete) */
  logs: CeremonyLog[];
  /** Current consecutive days streak */
  currentStreak: number;
  /** All-time longest streak achieved */
  longestStreak: number;
  /** Date string (YYYY-MM-DD) of last completed ceremony */
  lastCeremonyDate: string | null;
  /** Total ceremonies started (including incomplete) */
  totalCeremonies: number;
  /** Total ceremonies completed successfully */
  completedCeremonies: number;
  /** Whether a ceremony is currently in progress */
  ceremonyActive: boolean;
  /** Timestamp when current ceremony started (for duration calc on exit) */
  ceremonyStartTime: number | null;
  /** Date when user first completed a ceremony (member since) */
  memberSince: string | null;
}

/** Type-safe action signatures for ceremonyStore */
export type CeremonyActions = {
  // Actions
  addCeremonyLog: (duration: number, completed?: boolean) => void;
  setCeremonyActive: (active: boolean) => void;
  stopCeremonyAndLogIncomplete: () => void;
  resetStreak: () => void;
  loadCeremony: () => Promise<void>;
  // Selectors
  getMonthlyCount: () => number;
  getThisWeekCount: () => number;
  getTodayCeremony: () => CeremonyLog | undefined;
  getTodayCeremonyCount: () => number;
  getTodayCompletedCount: () => number;
  getTodayIncompleteCount: () => number;
  getRanking: () => { rank: number; percentile: number };
  getRecentLogs: (limit?: number) => CeremonyLog[];
  getCompletedCeremonies: () => number;
};

export interface HistoricalEvent {
  year: string;
  event: string;
}

// =============================================================================
// SETTINGS
// =============================================================================

export interface ReminderSettings {
  times: string[]; // Array of HH:mm format times (multiple ceremonies per day)
  days: number[]; // 0-6, Sunday = 0
}

export interface SettingsState {
  nickname: string;
  reminderSettings: ReminderSettings;
}

export type SettingsActions = {
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
  updateNickname: (nickname: string) => void;
  loadSettings: () => Promise<void>;
};

// =============================================================================
// SYNC
// =============================================================================

export interface SyncStoreState {
  /** Pending stats data waiting to be synced to server */
  pendingStats: SyncPayload[];
  /** Last synced nickname */
  lastSyncNickname: null | string;
  /** Server-verified stats - consumed by ceremonyStore for reconciliation */
  verifiedStats: null | VerifiedStats;
}

// =============================================================================
// BADGE
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

export interface CropSettings {
  /** Slider value for zoom (0 = 1x scale) */
  sliderValue: number;
  /** Pan X offset */
  translateX: number;
  /** Pan Y offset */
  translateY: number;
}

// =============================================================================
// APP STATE (Legacy - for reference)
// =============================================================================

export interface AppState {
  // Ceremony logs
  logs: CeremonyLog[];

  // Streak tracking
  currentStreak: number;
  longestStreak: number;
  lastCeremonyDate: string | null;

  // Settings
  reminderSettings: ReminderSettings;
  language: Language;

  // Stats
  totalCeremonies: number; // All ceremonies (completed + incomplete)
  completedCeremonies: number; // Only fully completed ceremonies (for achievements)

  // Ceremony in progress (for navigation blocking)
  ceremonyActive: boolean;
  ceremonyStartTime: number | null; // timestamp when ceremony started
}
