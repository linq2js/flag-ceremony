import type { SelectorContext } from "storion/react";
import { settingsStore } from "./settings";
import { ceremonyStore } from "./ceremony";
import { i18nStore } from "./i18n";

// === i18n mixins ===

export const tMixin = ({ get }: SelectorContext) => {
  const [, { t }] = get(i18nStore);
  return t;
};

export const languageMixin = ({ get }: SelectorContext) => {
  const [state] = get(i18nStore);
  return state.language;
};

export const dayNamesMixin = ({ get }: SelectorContext) => {
  const [state] = get(i18nStore);
  return state.dayNames;
};

export const setLanguageMixin = ({ get }: SelectorContext) => {
  const [, { setLanguage }] = get(i18nStore);
  return setLanguage;
};

// === Settings mixins ===

export const reminderSettingsMixin = ({ get }: SelectorContext) => {
  const [state] = get(settingsStore);
  return state.reminderSettings;
};

export const updateReminderSettingsMixin = ({ get }: SelectorContext) => {
  const [, { updateReminderSettings }] = get(settingsStore);
  return updateReminderSettings;
};

// === Ceremony mixins ===

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

export const getRankingMixin = ({ get }: SelectorContext) => {
  const [, { getRanking }] = get(ceremonyStore);
  return getRanking;
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
