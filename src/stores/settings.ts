import { store, type SelectorContext } from "storion/react";

import type { ReminderSettings } from "./types";
import { persisted } from "storion/persist";

export interface SettingsState {
  reminderSettings: ReminderSettings;
}

const initialState: SettingsState = {
  reminderSettings: {
    times: ["07:00"], // Default: one reminder at 7 AM
    days: [1, 2, 3, 4, 5], // Weekdays by default
  },
};

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
    };
  },
  meta: persisted(),
});

export type SettingsActions = {
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
  loadSettings: () => Promise<void>;
};

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
