import { store } from "storion/react";
import type { CeremonyLog } from "./types";
import { persisted } from "storion/persist";

export interface CeremonyState {
  logs: CeremonyLog[];
  currentStreak: number;
  longestStreak: number;
  lastCeremonyDate: string | null;
  totalCeremonies: number;
  completedCeremonies: number;
  ceremonyActive: boolean;
  ceremonyStartTime: number | null;
}

const initialState: CeremonyState = {
  logs: [],
  currentStreak: 0,
  longestStreak: 0,
  lastCeremonyDate: null,
  totalCeremonies: 0,
  completedCeremonies: 0,
  ceremonyActive: false,
  ceremonyStartTime: null,
};

// Helper to get today's date string (YYYY-MM-DD)
const getTodayString = () => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

// Helper to get yesterday's date string
const getYesterdayString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
};

// Calculate streak based on logs
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

export const ceremonyStore = store({
  name: "ceremony",
  state: initialState,
  setup: ({ state }) => {
    const addCeremonyLog = (duration: number, completed: boolean = true) => {
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
      }
    };

    const setCeremonyActive = (active: boolean) => {
      state.ceremonyActive = active;
      if (active) {
        state.ceremonyStartTime = Date.now();
      }
    };

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

    const resetStreak = () => {
      state.currentStreak = 0;
    };

    // Selectors
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

    const getTodayCeremony = () => {
      const today = getTodayString();
      return state.logs.find((log) => log.date === today);
    };

    const getTodayCeremonyCount = () => {
      const today = getTodayString();
      return state.logs.filter((log) => log.date === today).length;
    };

    const getTodayCompletedCount = () => {
      const today = getTodayString();
      return state.logs.filter((log) => log.date === today && log.completed)
        .length;
    };

    const getTodayIncompleteCount = () => {
      const today = getTodayString();
      return state.logs.filter((log) => log.date === today && !log.completed)
        .length;
    };

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

    const getCompletedCeremonies = () => state.completedCeremonies;

    const getRecentLogs = (limit: number = 10) => {
      return [...state.logs]
        .sort(
          (a, b) =>
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
        )
        .slice(0, limit);
    };

    return {
      addCeremonyLog,
      setCeremonyActive,
      stopCeremonyAndLogIncomplete,
      resetStreak,
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
  meta: persisted(),
});

export type CeremonyActions = {
  addCeremonyLog: (duration: number, completed?: boolean) => void;
  setCeremonyActive: (active: boolean) => void;
  stopCeremonyAndLogIncomplete: () => void;
  resetStreak: () => void;
  loadCeremony: () => Promise<void>;
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
