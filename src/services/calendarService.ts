import { Platform, Share } from "react-native";
import { Paths, File } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import type { Resolver } from "storion/react";

export interface CalendarSettings {
  time: string; // "HH:MM" format
  days: number[]; // 0 = Sunday, 1 = Monday, etc.
}

const DAY_CODES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

/**
 * Calendar Service - Exports recurring ceremony reminders to user's calendar
 */
export function calendarService(resolver: Resolver) {
  /** Generate deep link URL for the app */
  const getAppLink = (): string => {
    return Linking.createURL("ceremony");
  };

  const formatIcsDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const formatIcsTime = (hours: number, minutes: number): string => {
    return `${String(hours).padStart(2, "0")}${String(minutes).padStart(
      2,
      "0"
    )}00`;
  };

  const generateUid = (): string => {
    return `flag-ceremony-${Date.now()}@flagceremony.app`;
  };

  /** Generate iCalendar (.ics) file content */
  const generateIcsContent = (
    settings: CalendarSettings,
    language: "vi" | "en" = "en"
  ): string => {
    const [hours, minutes] = settings.time.split(":").map(Number);
    const appLink = getAppLink();

    const today = new Date();
    const startDate = new Date(today);
    startDate.setHours(hours, minutes, 0, 0);

    if (startDate <= today) {
      startDate.setDate(startDate.getDate() + 1);
    }

    while (!settings.days.includes(startDate.getDay())) {
      startDate.setDate(startDate.getDate() + 1);
    }

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 5);

    const byDay = settings.days.map((d) => DAY_CODES[d]).join(",");

    const title = language === "vi" ? "🇻🇳 Lễ Chào Cờ" : "🇻🇳 Flag Ceremony";
    const description =
      language === "vi"
        ? `Đã đến giờ chào cờ hàng ngày!\\n\\nMở ứng dụng: ${appLink}`
        : `Time for your daily flag ceremony!\\n\\nOpen app: ${appLink}`;
    const location =
      language === "vi" ? "Ứng dụng Lễ Chào Cờ" : "Flag Ceremony App";

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Flag Ceremony//Flag Ceremony App//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${title}
BEGIN:VEVENT
UID:${generateUid()}
DTSTAMP:${formatIcsDate(today)}T${formatIcsTime(
      today.getHours(),
      today.getMinutes()
    )}Z
DTSTART:${formatIcsDate(startDate)}T${formatIcsTime(hours, minutes)}
DTEND:${formatIcsDate(endDate)}T${formatIcsTime(
      endDate.getHours(),
      endDate.getMinutes()
    )}
RRULE:FREQ=WEEKLY;BYDAY=${byDay}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
URL:${appLink}
BEGIN:VALARM
TRIGGER:-PT0M
ACTION:DISPLAY
DESCRIPTION:${title}
END:VALARM
BEGIN:VALARM
TRIGGER:-PT5M
ACTION:DISPLAY
DESCRIPTION:${title} - 5 min
END:VALARM
END:VEVENT
END:VCALENDAR`;
  };

  /**
   * Export calendar event to user's device
   * Works on iOS, Android, and Web
   */
  const exportCalendar = async (
    settings: CalendarSettings,
    language: "vi" | "en" = "en"
  ): Promise<boolean> => {
    try {
      const icsContent = generateIcsContent(settings, language);
      const fileName = "flag-ceremony-reminder.ics";

      if (Platform.OS === "web") {
        const blob = new Blob([icsContent], { type: "text/calendar" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return true;
      }

      // expo-file-system v19+ API
      const file = new File(Paths.cache, fileName);
      await file.write(icsContent);
      const fileUri = file.uri;

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/calendar",
          dialogTitle:
            language === "vi"
              ? "Thêm nhắc nhở vào lịch"
              : "Add reminder to calendar",
          UTI: "public.calendar-event",
        });
        return true;
      }

      await Share.share({
        url: fileUri,
        title:
          language === "vi" ? "Nhắc nhở Lễ Chào Cờ" : "Flag Ceremony Reminder",
      });
      return true;
    } catch (error) {
      console.error("Failed to export calendar:", error);
      return false;
    }
  };

  return {
    /** Export calendar event with reminder to user's calendar app */
    exportCalendar,
    /** Generate .ics file content */
    generateIcsContent,
    /** Get the deep link URL for the app */
    getAppLink,
  };
}

export type CalendarService = ReturnType<typeof calendarService>;
