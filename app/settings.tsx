import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../src/store";
import { ScreenBackground } from "../src/components/ScreenBackground";
import { scheduleReminder, requestNotificationPermissions } from "../src/utils/notifications";
import { t, getDayNames, type Language } from "../src/i18n";

const glassStyle = Platform.select({
  web: { backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" },
  default: {},
});

export default function SettingsScreen() {
  const { reminderSettings, language, updateReminderSettings, setLanguage } = useAppStore(
    (s, a) => ({
      reminderSettings: s.reminderSettings,
      language: s.language,
      updateReminderSettings: a.updateReminderSettings,
      setLanguage: a.setLanguage,
    })
  );
  const [isScheduling, setIsScheduling] = useState(false);
  const dayNames = getDayNames(language);

  const handleReminderToggle = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
          Alert.alert(
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
      const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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

  const handleLanguageChange = useCallback(
    (lang: Language) => setLanguage(lang),
    [setLanguage]
  );

  const [hours, minutes] = reminderSettings.time.split(":").map(Number);

  return (
    <ScreenBackground>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 }}>
            <Text
              style={{
                fontSize: 12,
                color: "#fbbf24",
                textTransform: "uppercase",
                letterSpacing: 4,
                fontWeight: "600",
              }}
            >
              {t(language, "customize")}
            </Text>
            <Text
              style={{ fontSize: 36, fontWeight: "800", color: "#ffffff", marginTop: 6 }}
            >
              {t(language, "settings")}
            </Text>
          </View>

          {/* Language Section */}
          <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ fontSize: 22, marginRight: 10 }}>🌐</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>
                {t(language, "language")}
              </Text>
            </View>

            <View
              // @ts-ignore
              style={[
                {
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: 24,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.06)",
                },
                glassStyle,
              ]}
            >
              <TouchableOpacity
                onPress={() => handleLanguageChange("vi")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 18,
                  backgroundColor: language === "vi" ? "rgba(251, 191, 36, 0.1)" : "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(255,255,255,0.04)",
                }}
              >
                <Text style={{ fontSize: 32, marginRight: 16 }}>🇻🇳</Text>
                <Text style={{ flex: 1, fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
                  {t(language, "vietnamese")}
                </Text>
                {language === "vi" && (
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 13,
                      backgroundColor: "#fbbf24",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 14, color: "#1a0606" }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleLanguageChange("en")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 18,
                  backgroundColor: language === "en" ? "rgba(251, 191, 36, 0.1)" : "transparent",
                }}
              >
                <Text style={{ fontSize: 32, marginRight: 16 }}>🇬🇧</Text>
                <Text style={{ flex: 1, fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
                  {t(language, "english")}
                </Text>
                {language === "en" && (
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 13,
                      backgroundColor: "#fbbf24",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 14, color: "#1a0606" }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Reminder Section */}
          <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ fontSize: 22, marginRight: 10 }}>🔔</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>
                {t(language, "daily_reminder")}
              </Text>
            </View>

            <View
              // @ts-ignore
              style={[
                {
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: 24,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.06)",
                },
                glassStyle,
              ]}
            >
              {/* Toggle */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 18,
                  borderBottomWidth: reminderSettings.enabled ? 1 : 0,
                  borderBottomColor: "rgba(255,255,255,0.04)",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
                    {t(language, "enable_reminders")}
                  </Text>
                  <Text
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}
                  >
                    {t(language, "reminder_desc")}
                  </Text>
                </View>
                <Switch
                  value={reminderSettings.enabled}
                  onValueChange={handleReminderToggle}
                  trackColor={{ false: "rgba(255,255,255,0.08)", true: "rgba(251, 191, 36, 0.4)" }}
                  thumbColor={reminderSettings.enabled ? "#fbbf24" : "#555"}
                  disabled={isScheduling}
                />
              </View>

              {/* Time & Days */}
              {reminderSettings.enabled && (
                <>
                  <View
                    style={{
                      padding: 18,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.45)",
                        marginBottom: 14,
                      }}
                    >
                      {t(language, "reminder_time")}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginRight: 10 }}
                      >
                        {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                          <TouchableOpacity
                            key={h}
                            onPress={() => handleTimeChange(h, minutes)}
                            style={{
                              paddingHorizontal: 14,
                              paddingVertical: 10,
                              marginRight: 8,
                              borderRadius: 12,
                              backgroundColor:
                                h === hours ? "#fbbf24" : "rgba(255,255,255,0.06)",
                              borderWidth: 1,
                              borderColor:
                                h === hours ? "rgba(251, 191, 36, 0.5)" : "rgba(255,255,255,0.04)",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "700",
                                color: h === hours ? "#1a0606" : "rgba(255,255,255,0.5)",
                              }}
                            >
                              {String(h).padStart(2, "0")}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <Text
                        style={{
                          fontSize: 26,
                          fontWeight: "700",
                          color: "rgba(255,255,255,0.5)",
                          marginHorizontal: 6,
                        }}
                      >
                        :
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        {[0, 15, 30, 45].map((m) => (
                          <TouchableOpacity
                            key={m}
                            onPress={() => handleTimeChange(hours, m)}
                            style={{
                              paddingHorizontal: 14,
                              paddingVertical: 10,
                              marginRight: 8,
                              borderRadius: 12,
                              backgroundColor:
                                m === minutes ? "#fbbf24" : "rgba(255,255,255,0.06)",
                              borderWidth: 1,
                              borderColor:
                                m === minutes
                                  ? "rgba(251, 191, 36, 0.5)"
                                  : "rgba(255,255,255,0.04)",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "700",
                                color: m === minutes ? "#1a0606" : "rgba(255,255,255,0.5)",
                              }}
                            >
                              {String(m).padStart(2, "0")}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* Days */}
                  <View style={{ padding: 18 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.45)",
                        marginBottom: 14,
                      }}
                    >
                      {t(language, "repeat_on_days")}
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                        const isSelected = reminderSettings.days.includes(dayIndex);
                        return (
                          <TouchableOpacity
                            key={dayIndex}
                            onPress={() => handleDayToggle(dayIndex)}
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 14,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: isSelected
                                ? "#fbbf24"
                                : "rgba(255,255,255,0.06)",
                              borderWidth: 1,
                              borderColor: isSelected
                                ? "rgba(251, 191, 36, 0.5)"
                                : "rgba(255,255,255,0.04)",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: "700",
                                color: isSelected ? "#1a0606" : "rgba(255,255,255,0.5)",
                              }}
                            >
                              {dayNames[dayIndex]}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* About Section */}
          <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ fontSize: 22, marginRight: 10 }}>ℹ️</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>
                {t(language, "about")}
              </Text>
            </View>

            <View
              // @ts-ignore
              style={[
                {
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: 24,
                  padding: 28,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.06)",
                  alignItems: "center",
                  overflow: "hidden",
                },
                glassStyle,
              ]}
            >
              <View
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "#dc2626",
                  opacity: 0.08,
                }}
              />
              <Text style={{ fontSize: 72, marginBottom: 20 }}>🇻🇳</Text>
              <Text style={{ fontSize: 24, fontWeight: "800", color: "#ffffff" }}>
                {t(language, "app_name")}
              </Text>
              <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
                {t(language, "version")} 1.0.0
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.55)",
                  textAlign: "center",
                  lineHeight: 24,
                  marginTop: 20,
                }}
              >
                {t(language, "about_desc")}
              </Text>
            </View>
          </View>

          {/* Audio Section */}
          <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ fontSize: 22, marginRight: 10 }}>🎵</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>
                {t(language, "ceremony_audio")}
              </Text>
            </View>

            <View
              // @ts-ignore
              style={[
                {
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: 24,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.06)",
                },
                glassStyle,
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <Text style={{ fontSize: 26 }}>🎶</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: "#ffffff" }}>
                    flag-ceremony.mp3
                  </Text>
                  <Text
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}
                  >
                    {t(language, "add_audio_hint")}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  marginTop: 18,
                  backgroundColor: "rgba(251, 191, 36, 0.08)",
                  borderRadius: 14,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "rgba(251, 191, 36, 0.15)",
                }}
              >
                <Text style={{ fontSize: 13, color: "rgba(251, 191, 36, 0.9)", lineHeight: 22 }}>
                  💡 {t(language, "audio_tip")}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={{ marginHorizontal: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ fontSize: 22, marginRight: 10 }}>⚡</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>
                {t(language, "quick_actions")}
              </Text>
            </View>

            <View
              // @ts-ignore
              style={[
                {
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: 24,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.06)",
                },
                glassStyle,
              ]}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 18,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(255,255,255,0.04)",
                }}
                activeOpacity={0.7}
                onPress={() =>
                  Alert.alert(
                    t(language, "share_app"),
                    language === "vi"
                      ? "Tính năng chia sẻ sẽ được triển khai ở đây"
                      : "Sharing functionality would be implemented here"
                  )
                }
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <Text style={{ fontSize: 24 }}>📤</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: "#ffffff" }}>
                    {t(language, "share_app")}
                  </Text>
                  <Text
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}
                  >
                    {t(language, "invite_friends")}
                  </Text>
                </View>
                <Text style={{ fontSize: 20, color: "rgba(255,255,255,0.25)" }}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", padding: 18 }}
                activeOpacity={0.7}
                onPress={() =>
                  Alert.alert(
                    t(language, "rate_app"),
                    language === "vi"
                      ? "Tính năng đánh giá sẽ được triển khai ở đây"
                      : "Rating functionality would be implemented here"
                  )
                }
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <Text style={{ fontSize: 24 }}>⭐</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: "#ffffff" }}>
                    {t(language, "rate_app")}
                  </Text>
                  <Text
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}
                  >
                    {t(language, "leave_review")}
                  </Text>
                </View>
                <Text style={{ fontSize: 20, color: "rgba(255,255,255,0.25)" }}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}
