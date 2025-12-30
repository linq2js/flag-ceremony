// Container
export { app } from "./container";

// Stores
export { settingsStore } from "./settings";
export { ceremonyStore } from "./ceremony";
export { i18nStore } from "./i18n";
export { badgeStore } from "./badge";
export type { BadgeType, BadgeTheme, BadgeStats } from "./badge";
export { BADGE_THEMES, BADGE_TYPES } from "./badge";

// Services
export { calendarService } from "./services";
export type { CalendarSettings, CalendarService } from "./services";

// Mixins - i18n
export {
  tMixin,
  languageMixin,
  dayNamesMixin,
  setLanguageMixin,
} from "./mixins";

// Mixins - settings
export {
  reminderSettingsMixin,
  updateReminderSettingsMixin,
} from "./mixins";

// Mixins - ceremony
export {
  currentStreakMixin,
  longestStreakMixin,
  totalCeremoniesMixin,
  completedCeremoniesMixin,
  logsMixin,
  ceremonyActiveMixin,
  getThisWeekCountMixin,
  getTodayCompletedCountMixin,
  getTodayIncompleteCountMixin,
  getMonthlyCountMixin,
  getRecentLogsMixin,
  addCeremonyLogMixin,
  setCeremonyActiveMixin,
  stopCeremonyAndLogIncompleteMixin,
} from "./mixins";

// Mixins - leaderboard
export { rankingMixin } from "./mixins";

// Types
export type { SettingsState, SettingsActions } from "./settings";
export type { CeremonyState, CeremonyActions } from "./ceremony";
export type { I18nState, I18nActions } from "./i18n";
export type { AppState, CeremonyLog, ReminderSettings } from "./types";
