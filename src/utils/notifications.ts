import { Platform } from "react-native";
import Constants from "expo-constants";
import { app, notificationService } from "../store";
import type { ReminderSettings } from "../store/types";

// Check if we're on a native platform (notifications fully supported)
const isNative = Platform.OS === "ios" || Platform.OS === "android";

const isExpoGo =
  // Expo SDK 54+ (preferred)
  (Constants as any).executionEnvironment === "storeClient" ||
  // Older SDKs
  (Constants as any).appOwnership === "expo";

let notificationsPromise: Promise<
  typeof import("expo-notifications") | null
> | null = null;
let handlerInitialized = false;

async function getNotifications() {
  // Expo Go on Android crashes at import-time for expo-notifications (remote notifications removed).
  // We keep notifications behind a lazy import so SettingsScreen can still render in Expo Go.
  if (!isNative) return null;
  if (isExpoGo) return null;

  if (!notificationsPromise) {
    notificationsPromise = import("expo-notifications")
      .then((mod) => mod)
      .catch(() => null);
  }
  const Notifications = await notificationsPromise;
  if (!Notifications) return null;

  // Configure notification handler once
  if (!handlerInitialized) {
    handlerInitialized = true;
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }

  return Notifications;
}

export const requestNotificationPermissions = async (): Promise<boolean> => {
  // Notifications not fully supported on web
  if (!isNative) {
    console.warn("Notifications are not fully supported on web");
    return false;
  }

  const Notifications = await getNotifications();
  if (!Notifications) {
    console.warn(
      "Notifications are not supported in this environment (Expo Go / unsupported runtime)."
    );
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
};

export const scheduleReminder = async (
  settings: ReminderSettings
): Promise<string | null> => {
  // Notifications not fully supported on web
  if (!isNative) {
    console.warn("Scheduled notifications are not supported on web");
    return null;
  }

  const Notifications = await getNotifications();
  if (!Notifications) {
    console.warn(
      "Scheduled notifications are not supported in this environment (Expo Go / unsupported runtime)."
    );
    return null;
  }

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
      trigger: {
        weekday: day + 1, // Expo uses 1-7 for weekdays
        hour: hours,
        minute: minutes,
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      },
    });
    identifiers.push(identifier);
  }

  // Store the first identifier via DI service
  const mainId = identifiers[0] || null;
  const notifications = app.get(notificationService);
  notifications.setNotificationId(mainId);

  return mainId;
};

export const cancelReminder = async (): Promise<void> => {
  // Notifications not fully supported on web
  if (!isNative) {
    return;
  }

  const Notifications = await getNotifications();
  if (!Notifications) {
    return;
  }

  const notifications = app.get(notificationService);
  const notificationId = notifications.getNotificationId();

  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    notifications.setNotificationId(null);
  }

  // Also cancel all scheduled notifications to be safe
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const getDayName = (dayIndex: number): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayIndex];
};

export const getFullDayName = (dayIndex: number): string => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayIndex];
};
