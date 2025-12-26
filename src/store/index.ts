import { create } from "storion/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppState, CeremonyLog, ReminderSettings } from "./types";
import type { Language } from "../i18n";

const STORAGE_KEY = "@flag_ceremony_state";

const initialState: AppState = {
  logs: [],
  currentStreak: 0,
  longestStreak: 0,
  lastCeremonyDate: null,
  reminderSettings: {
    enabled: false,
    time: "07:00",
    days: [1, 2, 3, 4, 5], // Weekdays by default
  },
  notificationId: null,
  language: "vi", // Default to Vietnamese
  totalCeremonies: 0,
  completedCeremonies: 0,
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

// Persist to AsyncStorage
const persistState = async (state: AppState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to persist state:", error);
  }
};

export const [appStore, useAppStore] = create({
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

      persistState({ ...state });
    };

    const updateReminderSettings = (settings: Partial<ReminderSettings>) => {
      state.reminderSettings = {
        ...state.reminderSettings,
        ...settings,
      };
      persistState({ ...state });
    };

    const setNotificationId = (id: string | null) => {
      state.notificationId = id;
      persistState({ ...state });
    };

    const setLanguage = (lang: Language) => {
      state.language = lang;
      persistState({ ...state });
    };

    const resetStreak = () => {
      state.currentStreak = 0;
      persistState({ ...state });
    };

    const loadState = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AppState;

          // Migrate old logs without completed field
          const migratedLogs = parsed.logs.map((log) => ({
            ...log,
            completed: log.completed ?? true, // Assume old logs were completed
          }));

          // Recalculate streak on load (only from completed ceremonies)
          const completedLogs = migratedLogs.filter((l) => l.completed);
          const currentStreak = calculateStreak(
            completedLogs,
            parsed.lastCeremonyDate
          );

          state.logs = migratedLogs;
          state.currentStreak = currentStreak;
          state.longestStreak = parsed.longestStreak;
          state.lastCeremonyDate = parsed.lastCeremonyDate;
          state.reminderSettings = parsed.reminderSettings;
          state.notificationId = parsed.notificationId;
          state.language = parsed.language || "vi";
          state.totalCeremonies = parsed.totalCeremonies || migratedLogs.length;
          state.completedCeremonies =
            parsed.completedCeremonies ?? completedLogs.length;
        }
      } catch (error) {
        console.error("Failed to load state:", error);
      }
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
      // Use completed ceremonies for ranking (achievements)
      const completed = state.completedCeremonies;

      // Simulate ranking: more completed ceremonies = better rank
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
      updateReminderSettings,
      setNotificationId,
      setLanguage,
      resetStreak,
      loadState,
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
});

// Export actions for easy access
export const actions = {
  addCeremonyLog: (duration: number, completed: boolean = true) =>
    appStore.actions.addCeremonyLog(duration, completed),
  updateReminderSettings: (settings: Partial<ReminderSettings>) =>
    appStore.actions.updateReminderSettings(settings),
  setNotificationId: (id: string | null) =>
    appStore.actions.setNotificationId(id),
  setLanguage: (lang: Language) => appStore.actions.setLanguage(lang),
  resetStreak: () => appStore.actions.resetStreak(),
  loadState: () => appStore.actions.loadState(),
};

// Export selectors for easy access
export const selectors = {
  getMonthlyCount: () => appStore.actions.getMonthlyCount(),
  getThisWeekCount: () => appStore.actions.getThisWeekCount(),
  getTodayCeremony: () => appStore.actions.getTodayCeremony(),
  getTodayCeremonyCount: () => appStore.actions.getTodayCeremonyCount(),
  getTodayCompletedCount: () => appStore.actions.getTodayCompletedCount(),
  getTodayIncompleteCount: () => appStore.actions.getTodayIncompleteCount(),
  getRanking: () => appStore.actions.getRanking(),
  getRecentLogs: (limit?: number) => appStore.actions.getRecentLogs(limit),
  getCompletedCeremonies: () => appStore.actions.getCompletedCeremonies(),
};
