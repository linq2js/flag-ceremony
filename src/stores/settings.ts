/**
 * Settings Store - User preferences and configuration
 */
import { store, type SelectorContext } from "storion/react";
import type { ReminderSettings, SettingsState } from "./types";
import { persisted } from "storion/persist";

// Re-export types for convenience
export type { ReminderSettings, SettingsState, SettingsActions } from "./types";

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: SettingsState = {
  nickname: "",
  reminderSettings: {
    times: ["07:00"], // Default: one reminder at 7 AM
    days: [1, 2, 3, 4, 5], // Weekdays by default
  },
};

// =============================================================================
// STORE DEFINITION
// =============================================================================

export const settingsStore = store({
  name: "settings",
  state: initialState,
  setup: ({ state }) => {
    const updateReminderSettings = (settings: Partial<ReminderSettings>) => {
      state.reminderSettings = {
        ...state.reminderSettings,
        ...settings,
      };
    };

    return {
      updateReminderSettings,
      updateNickname: (nickname: string) => {
        state.nickname = nickname;
      },
    };
  },
  meta: persisted(),
});

// =============================================================================
// MIXINS
// =============================================================================

export const reminderSettingsMixin = ({ get }: SelectorContext) => {
  const [state] = get(settingsStore);
  return state.reminderSettings;
};

export const updateReminderSettingsMixin = ({ get }: SelectorContext) => {
  const [, { updateReminderSettings }] = get(settingsStore);
  return updateReminderSettings;
};

export const nicknameMixin = ({ get }: SelectorContext) => {
  const [state] = get(settingsStore);
  return state.nickname;
};

export const updateNicknameMixin = ({ get }: SelectorContext) => {
  const [, { updateNickname }] = get(settingsStore);
  return updateNickname;
};
