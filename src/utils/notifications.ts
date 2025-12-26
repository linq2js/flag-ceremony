import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { appStore } from "../store";
import type { ReminderSettings } from "../store/types";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
};

export const scheduleReminder = async (settings: ReminderSettings): Promise<string | null> => {
  if (!settings.enabled) {
    await cancelReminder();
    return null;
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    console.warn("Notification permissions not granted");
    return null;
  }

  // Cancel existing notification
  await cancelReminder();

  const [hours, minutes] = settings.time.split(":").map(Number);

  // Schedule for each selected day
  const identifiers: string[] = [];

  for (const day of settings.days) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "🇻🇳 Flag Ceremony Time!",
        body: "Start your day with honor. Begin your flag ceremony now!",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: Platform.OS === 'web' ? null : {
        weekday: day + 1, // Expo uses 1-7 for weekdays
        hour: hours,
        minute: minutes,
        repeats: true,
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      },
    });
    identifiers.push(identifier);
  }

  // Store the first identifier (we could store all, but for simplicity)
  const mainId = identifiers[0] || null;
  appStore.actions.setNotificationId(mainId);

  return mainId;
};

export const cancelReminder = async (): Promise<void> => {
  const state = appStore.state;

  if (state.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(state.notificationId);
    appStore.actions.setNotificationId(null);
  }

  // Also cancel all scheduled notifications to be safe
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const getDayName = (dayIndex: number): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayIndex];
};

export const getFullDayName = (dayIndex: number): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayIndex];
};
