import { store } from "storion/react";

import type { ReminderSettings } from "./types";
import { persisted } from "storion/persist";

export interface SettingsState {
  reminderSettings: ReminderSettings;
}

const initialState: SettingsState = {
  reminderSettings: {
    time: "07:00",
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
