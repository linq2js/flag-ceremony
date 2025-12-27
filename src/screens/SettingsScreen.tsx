import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Switch, TouchableOpacity } from "react-native";
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
} from "../store";
import { ScreenBackground } from "../components/ScreenBackground";
import {
  scheduleReminder,
  requestNotificationPermissions,
} from "../utils/notifications";
import {
  colors,
  palette,
  textStyles,
  spacing,
  radius,
  layout,
  cardStyles,
  listItem,
  iconContainer,
  glassEffect,
  decorativeOrb,
  calendarDay,
} from "../design";

export const SettingsScreen: React.FC = () => {
  const {
    t,
    language,
    dayNames,
    setLanguage,
    reminderSettings,
    updateReminderSettings,
  } = useStore({
    t: tMixin,
    language: languageMixin,
    dayNames: dayNamesMixin,
    setLanguage: setLanguageMixin,
    reminderSettings: reminderSettingsMixin,
    updateReminderSettings: updateReminderSettingsMixin,
  });
  const [isScheduling, setIsScheduling] = useState(false);
  const handleReminderToggle = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
          showAlert(
            language === "vi" ? "Cần cấp quyền" : "Permission Required",
            language === "vi"
              ? "Vui lòng bật thông báo trong cài đặt thiết bị để nhận nhắc nhở chào cờ."
              : "Please enable notifications in your device settings to receive ceremony reminders."
          );
          return;
        }
      }
      updateReminderSettings({ enabled });
      if (enabled) {
        setIsScheduling(true);
        await scheduleReminder({ ...reminderSettings, enabled: true });
        setIsScheduling(false);
      }
    },
    [reminderSettings, updateReminderSettings, language]
  );

  const handleTimeChange = useCallback(
    (hours: number, minutes: number) => {
      const time = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;
      updateReminderSettings({ time });
      if (reminderSettings.enabled) {
        scheduleReminder({ ...reminderSettings, time });
      }
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
      if (reminderSettings.enabled) {
        scheduleReminder({ ...reminderSettings, days: newDays });
      }
    },
    [reminderSettings, updateReminderSettings]
  );

  const [hours, minutes] = reminderSettings.time.split(":").map(Number);

  // Section header component
  const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
    <View style={[layout.row, { marginBottom: spacing[7] }]}>
      <Text style={{ fontSize: 22, marginRight: spacing[4] }}>{icon}</Text>
      <Text style={textStyles.sectionTitle}>{title}</Text>
    </View>
  );

  // Time button component
  const TimeButton = ({
    value,
    selected,
    onPress,
  }: {
    value: number;
    selected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: spacing[6],
        paddingVertical: spacing[4],
        marginRight: spacing[3],
        borderRadius: radius.md,
        backgroundColor: selected ? palette.gold[500] : palette.white[6],
        borderWidth: 1,
        borderColor: selected ? palette.gold[400] : palette.white[4],
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: selected ? palette.dark.base : palette.white[50],
        }}
      >
        {String(value).padStart(2, "0")}
      </Text>
    </TouchableOpacity>
  );

  // Day button component - matches Stats screen calendar style
  const DayButton = ({
    dayIndex,
    selected,
  }: {
    dayIndex: number;
    selected: boolean;
  }) => (
    <View style={{ alignItems: "center" }}>
      <Text
        style={[textStyles.statLabel, { marginBottom: spacing[4] }]}
      >
        {dayNames[dayIndex]}
      </Text>
      <TouchableOpacity
        onPress={() => handleDayToggle(dayIndex)}
        style={[
          calendarDay.cell,
          selected
            ? {
                backgroundColor: palette.gold[500],
                borderColor: palette.gold[400],
              }
            : calendarDay.default,
        ]}
      >
        {selected && (
          <Text style={{ fontSize: 18, color: palette.dark.base }}>✓</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenBackground>
      <SafeAreaView style={layout.screenContent} edges={["top"]}>
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

          {/* Language Section */}
          <View style={[layout.container, { marginBottom: spacing[10] }]}>
            <SectionHeader icon="🌐" title={t("language")} />

            <View
              // @ts-ignore
              style={[cardStyles.list, glassEffect]}
            >
              <TouchableOpacity
                onPress={() => setLanguage("vi")}
                style={[
                  listItem,
                  {
                    backgroundColor:
                      language === "vi" ? palette.gold[100] : "transparent",
                    borderBottomWidth: 1,
                    borderBottomColor: palette.white[4],
                  },
                ]}
              >
                <Text style={{ fontSize: 32, marginRight: spacing[7] }}>
                  🇻🇳
                </Text>
                <Text style={[textStyles.inputLabel, { flex: 1 }]}>
                  {t("vietnamese")}
                </Text>
                {language === "vi" && (
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 13,
                      backgroundColor: palette.gold[500],
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 14, color: palette.dark.base }}>
                      ✓
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setLanguage("en")}
                style={[
                  listItem,
                  {
                    backgroundColor:
                      language === "en" ? palette.gold[100] : "transparent",
                  },
                ]}
              >
                <Text style={{ fontSize: 32, marginRight: spacing[7] }}>
                  🇬🇧
                </Text>
                <Text style={[textStyles.inputLabel, { flex: 1 }]}>
                  {t("english")}
                </Text>
                {language === "en" && (
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 13,
                      backgroundColor: palette.gold[500],
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 14, color: palette.dark.base }}>
                      ✓
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Reminder Section */}
          <View style={[layout.container, { marginBottom: spacing[10] }]}>
            <SectionHeader icon="🔔" title={t("daily_reminder")} />

            <View
              // @ts-ignore
              style={[cardStyles.list, glassEffect]}
            >
              {/* Enable toggle */}
              <View
                style={[
                  listItem,
                  reminderSettings.enabled && {
                    borderBottomWidth: 1,
                    borderBottomColor: palette.white[4],
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={textStyles.inputLabel}>
                    {t("enable_reminders")}
                  </Text>
                  <Text
                    style={[textStyles.inputHint, { marginTop: spacing[1] }]}
                  >
                    {t("reminder_desc")}
                  </Text>
                </View>
                <Switch
                  value={reminderSettings.enabled}
                  onValueChange={handleReminderToggle}
                  trackColor={{
                    false: palette.white[8],
                    true: palette.gold[400],
                  }}
                  thumbColor={
                    reminderSettings.enabled ? palette.gold[500] : "#555"
                  }
                  disabled={isScheduling}
                />
              </View>

              {reminderSettings.enabled && (
                <>
                  {/* Time picker */}
                  <View
                    style={{
                      padding: spacing[8],
                      borderBottomWidth: 1,
                      borderBottomColor: palette.white[4],
                    }}
                  >
                    <Text
                      style={[
                        textStyles.inputHint,
                        { marginBottom: spacing[6] },
                      ]}
                    >
                      {t("reminder_time")}
                    </Text>
                    <View style={layout.row}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginRight: spacing[4] }}
                      >
                        {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                          <TimeButton
                            key={h}
                            value={h}
                            selected={h === hours}
                            onPress={() => handleTimeChange(h, minutes)}
                          />
                        ))}
                      </ScrollView>
                      <Text
                        style={{
                          fontSize: 26,
                          fontWeight: "700",
                          color: palette.white[50],
                          marginHorizontal: spacing[2],
                        }}
                      >
                        :
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        {[0, 15, 30, 45].map((m) => (
                          <TimeButton
                            key={m}
                            value={m}
                            selected={m === minutes}
                            onPress={() => handleTimeChange(hours, m)}
                          />
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* Day picker */}
                  <View style={{ padding: spacing[8] }}>
                    <Text
                      style={[
                        textStyles.inputHint,
                        { marginBottom: spacing[6] },
                      ]}
                    >
                      {t("repeat_on_days")}
                    </Text>
                    <View style={layout.rowBetween}>
                      {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                        <DayButton
                          key={dayIndex}
                          dayIndex={dayIndex}
                          selected={reminderSettings.days.includes(dayIndex)}
                        />
                      ))}
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* About Section */}
          <View style={[layout.container, { marginBottom: spacing[10] }]}>
            <SectionHeader icon="ℹ️" title={t("about")} />

            <View
              // @ts-ignore
              style={[
                cardStyles.default,
                { padding: spacing[11], alignItems: "center" },
                glassEffect,
              ]}
            >
              <View
                style={decorativeOrb(palette.crimson[500], 120, {
                  top: -40,
                  right: -40,
                })}
              />
              <Text style={{ fontSize: 72, marginBottom: spacing[9] }}>🇻🇳</Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: colors.text.primary,
                }}
              >
                {t("app_name")}
              </Text>
              <Text style={[textStyles.sublabel, { marginTop: spacing[2] }]}>
                {t("version")} 1.0.0
              </Text>
              <Text
                style={[
                  textStyles.body,
                  { textAlign: "center", marginTop: spacing[9] },
                ]}
              >
                {t("about_desc")}
              </Text>
            </View>
          </View>

          {/* Quick Actions Section */}
          <View style={layout.container}>
            <SectionHeader icon="⚡" title={t("quick_actions")} />

            <View
              // @ts-ignore
              style={[cardStyles.list, glassEffect]}
            >
              <TouchableOpacity
                style={[
                  listItem,
                  { borderBottomWidth: 1, borderBottomColor: palette.white[4] },
                ]}
                activeOpacity={0.7}
                onPress={() =>
                  showAlert(t("coming_soon"), t("coming_soon_message"))
                }
              >
                <View
                  style={[
                    iconContainer.xlarge,
                    {
                      backgroundColor: palette.white[6],
                      borderWidth: 1,
                      borderColor: palette.white[8],
                      marginRight: spacing[7],
                    },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>📤</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={textStyles.inputLabel}>{t("share_app")}</Text>
                  <Text
                    style={[textStyles.inputHint, { marginTop: spacing[1] }]}
                  >
                    {t("invite_friends")}
                  </Text>
                </View>
                <Text style={{ fontSize: 20, color: palette.white[25] }}>
                  →
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={listItem}
                activeOpacity={0.7}
                onPress={() =>
                  showAlert(t("coming_soon"), t("coming_soon_message"))
                }
              >
                <View
                  style={[
                    iconContainer.xlarge,
                    {
                      backgroundColor: palette.white[6],
                      borderWidth: 1,
                      borderColor: palette.white[8],
                      marginRight: spacing[7],
                    },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>⭐</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={textStyles.inputLabel}>{t("rate_app")}</Text>
                  <Text
                    style={[textStyles.inputHint, { marginTop: spacing[1] }]}
                  >
                    {t("leave_review")}
                  </Text>
                </View>
                <Text style={{ fontSize: 20, color: palette.white[25] }}>
                  →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};
