/**
 * Ceremony Store - Core state management for flag ceremony tracking
 *
 * Responsibilities:
 * - Track ceremony logs (completed and incomplete)
 * - Calculate and maintain streaks (current and longest)
 * - Manage ceremony active state (for exit confirmation)
 * - Trigger background sync to Supabase via syncStore
 *
 * Data flow on ceremony completion:
 * ```
 * addCeremonyLog(duration, completed=true)
 *     │
 *     ├── Update local state (logs, streaks, counts)
 *     │
 *     └── setPendingSync() ──► syncStore ──► Supabase
 *                                   │
 *                                   ▼
 *                          leaderboardStore.success(ranking)
 * ```
 *
 * Persistence: All state is persisted via `persisted()` meta.
 */
import {
  batch,
  effect,
  meta,
  store,
  type SelectorContext,
} from "storion/react";
import type { CeremonyLog, CeremonyState } from "./types";
import { notPersisted, persisted } from "storion/persist";
import { syncStore } from "./sync";

// Re-export types for convenience
export type { CeremonyLog, CeremonyState, CeremonyActions } from "./types";

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: CeremonyState = {
  logs: [],
  currentStreak: 0,
  longestStreak: 0,
  lastCeremonyDate: null,
  totalCeremonies: 0,
  completedCeremonies: 0,
  ceremonyActive: false,
  ceremonyStartTime: null,
  memberSince: null,
};

// =============================================================================
// DATE HELPERS
// =============================================================================

/** Get today's date as YYYY-MM-DD string */
const getTodayString = () => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

/** Get yesterday's date as YYYY-MM-DD string */
const getYesterdayString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
};

// =============================================================================
// STREAK CALCULATION
// =============================================================================

/**
 * Calculate current streak from ceremony logs.
 *
 * Rules:
 * - Streak continues if last ceremony was today or yesterday
 * - Counts consecutive days with at least one completed ceremony
 * - Breaks if there's a gap of 2+ days
 *
 * @param logs - Completed ceremony logs only
 * @param lastDate - Date of most recent ceremony
 * @returns Current streak count
 */
const calculateStreak = (
  logs: CeremonyLog[],
  lastDate: string | null
): number => {
  if (!lastDate) return 0;

  const today = getTodayString();
  const yesterday = getYesterdayString();

  // If last ceremony was not today or yesterday, streak is broken
  if (lastDate !== today && lastDate !== yesterday) {
    return 0;
  }

  // Count consecutive days
  let streak = 0;
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const uniqueDates = [...new Set(sortedLogs.map((log) => log.date))];

  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateString = expectedDate.toISOString().split("T")[0];

    // Allow for yesterday if we haven't done today's ceremony yet
    if (i === 0 && uniqueDates[0] === yesterday) {
      streak++;
      continue;
    }

    if (uniqueDates[i] === expectedDateString) {
      streak++;
    } else if (i === 0 && uniqueDates[0] !== today) {
      // If first date isn't today, check if it's yesterday
      const adjustedExpected = new Date();
      adjustedExpected.setDate(adjustedExpected.getDate() - 1 - i);
      if (uniqueDates[i] === adjustedExpected.toISOString().split("T")[0]) {
        streak++;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
};

// =============================================================================
// STORE DEFINITION
// =============================================================================

export const ceremonyStore = store({
  name: "ceremony",
  state: initialState,
  setup: ({ state, get }) => {
    // Get sync state and actions
    const [syncState, { addPendingStats }] = get(syncStore);

    // -------------------------------------------------------------------------
    // RECONCILIATION EFFECT
    // -------------------------------------------------------------------------
    // Listen to verifiedStats changes from syncStore and reconcile local state.
    // This ensures local stats match server-verified values after sync.
    // Server is the source of truth for leaderboard stats.
    effect(() => {
      const verifiedStats = syncState.verifiedStats;
      if (!verifiedStats) return;

      // Overwrite local stats with server-verified values
      state.completedCeremonies = verifiedStats.completed;
      state.currentStreak = verifiedStats.currentStreak;
      // Keep the higher value for longestStreak (local might be ahead of server)
      state.longestStreak = Math.max(
        state.longestStreak,
        verifiedStats.longestStreak
      );
    });

    // -------------------------------------------------------------------------
    // ACTIONS
    // -------------------------------------------------------------------------

    /**
     * Log a ceremony (completed or incomplete).
     *
     * - Creates log entry with unique ID and timestamp
     * - Updates streak calculations for completed ceremonies
     * - Triggers background sync to Supabase for completed ceremonies
     *
     * @param duration - Ceremony duration in seconds
     * @param completed - Whether ceremony was fully completed (default: true)
     */
    const addCeremonyLog = (duration: number, completed: boolean = true) => {
      batch(() => {
        const today = getTodayString();
        const now = new Date().toISOString();

        const newLog: CeremonyLog = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          date: today,
          completedAt: now,
          duration,
          completed,
        };

        state.logs = [...state.logs, newLog];
        state.totalCeremonies = state.totalCeremonies + 1;

        // Only count completed ceremonies for streak and achievements
        if (completed) {
          state.completedCeremonies = state.completedCeremonies + 1;
          state.currentStreak = calculateStreak(
            state.logs.filter((l) => l.completed),
            today
          );
          state.longestStreak = Math.max(
            state.longestStreak,
            state.currentStreak
          );
          state.lastCeremonyDate = today;

          // Set memberSince on first completed ceremony
          if (!state.memberSince) {
            state.memberSince = today;
          }

          // Sync completed ceremony to Supabase in background
          // - syncStore will authenticate and call syncStats()
          // - Server logs ceremony with the provided date (supports offline)
          // - Server calculates all stats from ceremonies table
          // - Returns updated ranking which leaderboardStore consumes via .success()
          addPendingStats({ ceremonyDate: today });
        }
      });
    };

    /**
     * Set ceremony active state.
     * Called when ceremony starts/ends to track in-progress state.
     * Used for exit confirmation and partial duration logging.
     */
    const setCeremonyActive = (active: boolean) => {
      state.ceremonyActive = active;
      if (active) {
        state.ceremonyStartTime = Date.now();
      }
    };

    /**
     * Stop active ceremony and log as incomplete.
     * Called when user exits ceremony early (back button, app background).
     * Logs partial duration for analytics.
     */
    const stopCeremonyAndLogIncomplete = () => {
      if (state.ceremonyActive && state.ceremonyStartTime) {
        const partialDuration = Math.floor(
          (Date.now() - state.ceremonyStartTime) / 1000
        );
        addCeremonyLog(partialDuration, false);
      }
      state.ceremonyActive = false;
      state.ceremonyStartTime = null;
    };

    /** Reset current streak to 0 (used for testing/admin) */
    const resetStreak = () => {
      state.currentStreak = 0;
    };

    // -------------------------------------------------------------------------
    // SELECTORS (computed values from state)
    // -------------------------------------------------------------------------

    /** Get total ceremonies this month */
    const getMonthlyCount = () => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      return state.logs.filter((log) => {
        const logDate = new Date(log.date);
        return (
          logDate.getMonth() === currentMonth &&
          logDate.getFullYear() === currentYear
        );
      }).length;
    };

    /** Get total ceremonies this week (Sunday-Saturday) */
    const getThisWeekCount = () => {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      return state.logs.filter((log) => {
        const logDate = new Date(log.date);
        return logDate >= startOfWeek;
      }).length;
    };

    /** Get first ceremony log from today (if any) */
    const getTodayCeremony = () => {
      const today = getTodayString();
      return state.logs.find((log) => log.date === today);
    };

    /** Get total ceremonies today (completed + incomplete) */
    const getTodayCeremonyCount = () => {
      const today = getTodayString();
      return state.logs.filter((log) => log.date === today).length;
    };

    /** Get completed ceremonies today */
    const getTodayCompletedCount = () => {
      const today = getTodayString();
      return state.logs.filter((log) => log.date === today && log.completed)
        .length;
    };

    /** Get incomplete ceremonies today */
    const getTodayIncompleteCount = () => {
      const today = getTodayString();
      return state.logs.filter((log) => log.date === today && !log.completed)
        .length;
    };

    /**
     * Get local ranking estimate based on completed ceremonies.
     * Used as fallback when Supabase ranking is unavailable.
     */
    const getRanking = () => {
      const completed = state.completedCeremonies;

      if (completed >= 100) return { rank: 1, percentile: 99 };
      if (completed >= 50)
        return { rank: Math.floor(100 - completed), percentile: 95 };
      if (completed >= 30)
        return { rank: Math.floor(200 - completed * 2), percentile: 90 };
      if (completed >= 10)
        return { rank: Math.floor(500 - completed * 10), percentile: 75 };
      if (completed >= 5)
        return { rank: Math.floor(1000 - completed * 50), percentile: 50 };
      return { rank: Math.floor(5000 - completed * 100), percentile: 25 };
    };

    /** Get total completed ceremonies count */
    const getCompletedCeremonies = () => state.completedCeremonies;

    /** Get most recent logs, sorted by completedAt descending */
    const getRecentLogs = (limit: number = 10) => {
      return [...state.logs]
        .sort(
          (a, b) =>
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
        )
        .slice(0, limit);
    };

    // -------------------------------------------------------------------------
    // RETURN ACTIONS & SELECTORS
    // -------------------------------------------------------------------------

    return {
      // Actions
      addCeremonyLog,
      setCeremonyActive,
      stopCeremonyAndLogIncomplete,
      resetStreak,
      // Selectors
      getMonthlyCount,
      getThisWeekCount,
      getTodayCeremony,
      getTodayCeremonyCount,
      getTodayCompletedCount,
      getTodayIncompleteCount,
      getRanking,
      getRecentLogs,
      getCompletedCeremonies,
    };
  },
  // Persist state except runtime props (ceremonyActive, ceremonyStartTime)
  meta: meta.of(
    persisted(),
    notPersisted.for(["ceremonyActive", "ceremonyStartTime"])
  ),
});

// =============================================================================
// MIXINS
// =============================================================================

export const currentStreakMixin = ({ get }: SelectorContext) => {
  const [state] = get(ceremonyStore);
  return state.currentStreak;
};

export const longestStreakMixin = ({ get }: SelectorContext) => {
  const [state] = get(ceremonyStore);
  return state.longestStreak;
};

export const totalCeremoniesMixin = ({ get }: SelectorContext) => {
  const [state] = get(ceremonyStore);
  return state.totalCeremonies;
};

export const completedCeremoniesMixin = ({ get }: SelectorContext) => {
  const [state] = get(ceremonyStore);
  return state.completedCeremonies;
};

export const logsMixin = ({ get }: SelectorContext) => {
  const [state] = get(ceremonyStore);
  return state.logs;
};

export const memberSinceMixin = ({ get }: SelectorContext) => {
  const [state] = get(ceremonyStore);
  return state.memberSince;
};

export const ceremonyActiveMixin = ({ get }: SelectorContext) => {
  const [state] = get(ceremonyStore);
  return state.ceremonyActive;
};

export const getThisWeekCountMixin = ({ get }: SelectorContext) => {
  const [, { getThisWeekCount }] = get(ceremonyStore);
  return getThisWeekCount;
};

export const getTodayCompletedCountMixin = ({ get }: SelectorContext) => {
  const [, { getTodayCompletedCount }] = get(ceremonyStore);
  return getTodayCompletedCount;
};

export const getTodayIncompleteCountMixin = ({ get }: SelectorContext) => {
  const [, { getTodayIncompleteCount }] = get(ceremonyStore);
  return getTodayIncompleteCount;
};

export const getMonthlyCountMixin = ({ get }: SelectorContext) => {
  const [, { getMonthlyCount }] = get(ceremonyStore);
  return getMonthlyCount;
};

export const getRecentLogsMixin = ({ get }: SelectorContext) => {
  const [, { getRecentLogs }] = get(ceremonyStore);
  return getRecentLogs;
};

export const addCeremonyLogMixin = ({ get }: SelectorContext) => {
  const [, { addCeremonyLog }] = get(ceremonyStore);
  return addCeremonyLog;
};

export const setCeremonyActiveMixin = ({ get }: SelectorContext) => {
  const [, { setCeremonyActive }] = get(ceremonyStore);
  return setCeremonyActive;
};

export const stopCeremonyAndLogIncompleteMixin = ({ get }: SelectorContext) => {
  const [, { stopCeremonyAndLogIncomplete }] = get(ceremonyStore);
  return stopCeremonyAndLogIncomplete;
};
