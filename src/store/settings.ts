import { store } from "storion/react";

import type { ReminderSettings } from "./types";
import { persisted } from "storion/persist";

export interface SettingsState {
  reminderSettings: ReminderSettings;
  notificationId: string | null;
}

const initialState: SettingsState = {
  reminderSettings: {
    enabled: false,
    time: "07:00",
    days: [1, 2, 3, 4, 5], // Weekdays by default
  },
  notificationId: null,
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

    const setNotificationId = (id: string | null) => {
      state.notificationId = id;
    };

    return {
      updateReminderSettings,
      setNotificationId,
    };
  },
  meta: persisted(),
});

export type SettingsActions = {
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
  setNotificationId: (id: string | null) => void;
  loadSettings: () => Promise<void>;
};
