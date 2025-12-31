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
  nicknameMixin,
  calendarService,
} from "../stores";
import { ScreenBackground } from "../components/ScreenBackground";
import { NicknameModal } from "../components/NicknameModal";
import { textStyles, spacing, layout } from "../design";
import {
  NicknameSection,
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
    nickname,
    calendar,
  } = useStore((ctx) => ({
    t: tMixin(ctx),
    language: languageMixin(ctx),
    dayNames: dayNamesMixin(ctx),
    setLanguage: setLanguageMixin(ctx),
    reminderSettings: reminderSettingsMixin(ctx),
    updateReminderSettings: updateReminderSettingsMixin(ctx),
    nickname: nicknameMixin(ctx),
    calendar: ctx.get(calendarService),
  }));

  const [isExporting, setIsExporting] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  const handleAddTime = useCallback(
    (time: string) => {
      const currentTimes = reminderSettings.times || [];
      if (!currentTimes.includes(time)) {
        updateReminderSettings({ times: [...currentTimes, time].sort() });
      }
    },
    [reminderSettings, updateReminderSettings]
  );

  const handleRemoveTime = useCallback(
    (index: number) => {
      const currentTimes = reminderSettings.times || [];
      const newTimes = currentTimes.filter((_, i) => i !== index);
      updateReminderSettings({ times: newTimes });
    },
    [reminderSettings, updateReminderSettings]
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
    const times = reminderSettings.times || [];
    setIsExporting(true);
    try {
      const success = await calendar.exportCalendar(
        {
          times,
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

  const handleShowAlert = useCallback((title: string, message: string) => {
    showAlert(title, message);
  }, []);

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

          <NicknameSection
            t={t as any}
            nickname={nickname}
            onChangeNickname={() => setShowNicknameModal(true)}
          />

          <LanguageSection
            t={t as any}
            language={language}
            setLanguage={setLanguage}
          />

          <ReminderSection
            t={t as any}
            dayNames={dayNames}
            reminderSettings={{
              ...reminderSettings,
              times: reminderSettings.times || [], // Migration fallback
            }}
            isExporting={isExporting}
            onAddTime={handleAddTime}
            onRemoveTime={handleRemoveTime}
            onDayToggle={handleDayToggle}
            onExportCalendar={handleExportCalendar}
            onShowAlert={handleShowAlert}
          />

          <AboutSection t={t as any} />

          <QuickActionsSection t={t as any} />
        </ScrollView>

        {/* Nickname change modal */}
        <NicknameModal
          visible={showNicknameModal}
          onClose={() => setShowNicknameModal(false)}
          onSave={() => setShowNicknameModal(false)}
        />
      </SafeAreaView>
    </ScreenBackground>
  );
};
