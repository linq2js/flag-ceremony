import type { Language } from "../i18n";

export interface CeremonyLog {
  id: string;
  date: string; // ISO string
  completedAt: string; // ISO string with time
  duration: number; // in seconds
  completed: boolean; // true if ceremony was fully completed
}

export interface ReminderSettings {
  time: string; // HH:mm format
  days: number[]; // 0-6, Sunday = 0
}

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

export interface HistoricalEvent {
  year: string;
  event: string;
}
