import React, { useState, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import { showAlert } from "../utils/alert";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore } from "storion/react";
import {
  tMixin,
  languageMixin,
  dayNamesMixin,
  setLanguageMixin,
  reminderSettingsMixin,
  updateReminderSettingsMixin,
  calendarService,
} from "../store";
import { ScreenBackground } from "../components/ScreenBackground";
import { textStyles, spacing, layout } from "../design";
import {
  LanguageSection,
  ReminderSection,
  AboutSection,
  QuickActionsSection,
} from "../components/settings";

export const SettingsScreen: React.FC = () => {
  const {
    t,
    language,
    dayNames,
    setLanguage,
    reminderSettings,
    updateReminderSettings,
    calendar,
  } = useStore((ctx) => ({
    t: tMixin(ctx),
    language: languageMixin(ctx),
    dayNames: dayNamesMixin(ctx),
    setLanguage: setLanguageMixin(ctx),
    reminderSettings: reminderSettingsMixin(ctx),
    updateReminderSettings: updateReminderSettingsMixin(ctx),
    calendar: ctx.get(calendarService),
  }));

  const [isExporting, setIsExporting] = useState(false);

  const handleTimeChange = useCallback(
    (hours: number, minutes: number) => {
      const time = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;
      updateReminderSettings({ time });
    },
    [updateReminderSettings]
  );

  const handleDayToggle = useCallback(
    (dayIndex: number) => {
      const currentDays = reminderSettings.days;
      const newDays = currentDays.includes(dayIndex)
        ? currentDays.filter((d) => d !== dayIndex)
        : [...currentDays, dayIndex].sort();
      updateReminderSettings({ days: newDays });
    },
    [reminderSettings, updateReminderSettings]
  );

  const handleExportCalendar = useCallback(async () => {
    if (reminderSettings.days.length === 0) {
      showAlert(
        language === "vi" ? "Chưa chọn ngày" : "No Days Selected",
        language === "vi"
          ? "Vui lòng chọn ít nhất một ngày để nhắc nhở."
          : "Please select at least one day for reminders."
      );
      return;
    }

    setIsExporting(true);
    try {
      const success = await calendar.exportCalendar(
        {
          time: reminderSettings.time,
          days: reminderSettings.days,
        },
        language
      );
      if (success) {
        showAlert(
          language === "vi" ? "Thành công!" : "Success!",
          language === "vi"
            ? "Đã xuất file lịch. Mở file để thêm nhắc nhở vào ứng dụng lịch của bạn."
            : "Calendar file exported. Open the file to add reminders to your calendar app."
        );
      }
    } catch (error) {
      showAlert(
        language === "vi" ? "Lỗi" : "Error",
        language === "vi"
          ? "Không thể xuất file lịch. Vui lòng thử lại."
          : "Failed to export calendar file. Please try again."
      );
    } finally {
      setIsExporting(false);
    }
  }, [reminderSettings, language, calendar]);

  return (
    <ScreenBackground>
      <SafeAreaView
        testID="settings-screen"
        accessibilityLabel="settings-screen"
        style={layout.screenContent}
        edges={["top"]}
      >
        <ScrollView
          style={layout.screenContent}
          contentContainerStyle={layout.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              paddingHorizontal: spacing[9],
              paddingTop: spacing[9],
              paddingBottom: spacing[10],
            }}
          >
            <Text style={textStyles.label}>{t("customize")}</Text>
            <Text style={[textStyles.screenTitle, { marginTop: spacing[2] }]}>
              {t("settings")}
            </Text>
          </View>

          <LanguageSection
            t={t as any}
            language={language}
            setLanguage={setLanguage}
          />

          <ReminderSection
            t={t as any}
            dayNames={dayNames}
            reminderSettings={reminderSettings}
            isExporting={isExporting}
            onTimeChange={handleTimeChange}
            onDayToggle={handleDayToggle}
            onExportCalendar={handleExportCalendar}
          />

          <AboutSection t={t as any} />

          <QuickActionsSection t={t as any} />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};
