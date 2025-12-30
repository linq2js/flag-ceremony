import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  layout,
  spacing,
  cardStyles,
  glassEffect,
  palette,
  textStyles,
  buttonStyles,
  buttonContainer,
} from "../../design";
import { SectionHeader } from "./SectionHeader";
import { TimeButton } from "./TimeButton";
import { DayButton } from "./DayButton";
import { CalendarIcon, DownloadIcon } from "../Icons";

interface ReminderSettings {
  times: string[];
  days: number[];
}

interface ReminderSectionProps {
  t: (key: string, params?: Record<string, unknown>) => string;
  dayNames: string[];
  reminderSettings: ReminderSettings;
  isExporting: boolean;
  onAddTime: (time: string) => void;
  onRemoveTime: (index: number) => void;
  onDayToggle: (dayIndex: number) => void;
  onExportCalendar: () => void;
  onShowAlert: (title: string, message: string) => void;
}

const MAX_TIMES = 3;

export const ReminderSection: React.FC<ReminderSectionProps> = ({
  t,
  dayNames,
  reminderSettings,
  isExporting,
  onAddTime,
  onRemoveTime,
  onDayToggle,
  onExportCalendar,
  onShowAlert,
}) => {
  const [selectedHour, setSelectedHour] = useState(7);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const formatTime = (h: number, m: number) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  const selectedTime = formatTime(selectedHour, selectedMinute);
  const isTimeAlreadyAdded = reminderSettings.times.includes(selectedTime);
  const isMaxTimesReached = reminderSettings.times.length >= MAX_TIMES;

  const handleAddTime = () => {
    if (isMaxTimesReached) {
      onShowAlert(t("max_times_reached"), t("max_times_message"));
      return;
    }
    if (isTimeAlreadyAdded) {
      onShowAlert(t("time_exists"), t("time_exists_message"));
      return;
    }
    onAddTime(selectedTime);
  };

  const handleExportCalendar = () => {
    if (reminderSettings.times.length === 0 && reminderSettings.days.length === 0) {
      onShowAlert(t("incomplete_config"), t("add_times_and_days"));
      return;
    }
    if (reminderSettings.times.length === 0) {
      onShowAlert(t("no_times"), t("add_at_least_one_time"));
      return;
    }
    if (reminderSettings.days.length === 0) {
      onShowAlert(t("no_days"), t("select_at_least_one_day"));
      return;
    }
    onExportCalendar();
  };

  // Sort times for display
  const sortedTimes = [...reminderSettings.times].sort();

  return (
    <View style={[layout.container, { marginBottom: spacing[10] }]}>
      <SectionHeader
        icon={<CalendarIcon size={20} color={palette.gold[500]} />}
        title={t("daily_reminder")}
      />

      <View
        // @ts-ignore - glassEffect contains web-only props
        style={[cardStyles.list, glassEffect]}
      >
        {/* Calendar export info */}
        <View
          style={{
            padding: spacing[8],
            borderBottomWidth: 1,
            borderBottomColor: palette.white[4],
          }}
        >
          <Text style={textStyles.inputLabel}>{t("add_to_calendar")}</Text>
          <Text style={[textStyles.inputHint, { marginTop: spacing[1] }]}>
            {t("calendar_desc")}
          </Text>
        </View>

        {/* Day picker - MOVED UP */}
        <View
          style={{
            padding: spacing[8],
            borderBottomWidth: 1,
            borderBottomColor: palette.white[4],
          }}
        >
          <Text style={[textStyles.inputHint, { marginBottom: spacing[6] }]}>
            {t("repeat_on_days")}
          </Text>
          <View style={layout.rowBetween}>
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
              <DayButton
                key={dayIndex}
                dayName={dayNames[dayIndex]}
                selected={reminderSettings.days.includes(dayIndex)}
                onPress={() => onDayToggle(dayIndex)}
              />
            ))}
          </View>
        </View>

        {/* Configured times list - MOVED UP */}
        <View
          style={{
            padding: spacing[8],
            borderBottomWidth: 1,
            borderBottomColor: palette.white[4],
          }}
        >
          <Text style={[textStyles.inputHint, { marginBottom: spacing[4] }]}>
            {t("reminder_times")} ({reminderSettings.times.length}/{MAX_TIMES})
          </Text>

          {sortedTimes.length === 0 ? (
            <Text
              style={[
                textStyles.inputHint,
                { fontStyle: "italic", color: palette.white[30] },
              ]}
            >
              {t("no_times_configured")}
            </Text>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {sortedTimes.map((time) => {
                const originalIndex = reminderSettings.times.indexOf(time);
                return (
                  <View
                    key={time}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: palette.white[6],
                      paddingLeft: spacing[5],
                      paddingRight: spacing[3],
                      paddingVertical: spacing[4],
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: palette.white[70],
                        fontVariant: ["tabular-nums"],
                        marginRight: spacing[3],
                      }}
                    >
                      {time}
                    </Text>
                    <TouchableOpacity
                      onPress={() => onRemoveTime(originalIndex)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: palette.white[10],
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: palette.white[50],
                          fontWeight: "600",
                        }}
                      >
                        ×
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Time picker to add new time */}
        <View
          style={{
            padding: spacing[8],
            borderBottomWidth: 1,
            borderBottomColor: palette.white[4],
          }}
        >
          {/* Preview and Add button */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: spacing[6],
            }}
          >
            <Text style={textStyles.inputHint}>{t("add_time")}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: palette.white[8],
                  paddingHorizontal: spacing[5],
                  paddingVertical: spacing[3],
                  borderRadius: 8,
                  marginRight: spacing[3],
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: palette.white[70],
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {selectedTime}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleAddTime}
                activeOpacity={0.85}
                style={[buttonStyles.primary, buttonStyles.small]}
              >
                <Text style={[buttonStyles.primaryText, buttonStyles.smallText]}>
                  + {t("add")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hour picker */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing[3] }}>
            <Text
              style={[
                textStyles.inputHint,
                { fontSize: 11 },
              ]}
            >
              {t("hour")}
            </Text>
            <Text
              style={[
                textStyles.inputHint,
                { fontSize: 10, marginLeft: spacing[3], opacity: 0.6 },
              ]}
            >
              {t("hour_swipe_hint")}
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: spacing[6] }}
          >
            {Array.from({ length: 24 }, (_, i) => i).map((h) => (
              <TimeButton
                key={h}
                value={h}
                selected={h === selectedHour}
                onPress={() => setSelectedHour(h)}
              />
            ))}
          </ScrollView>

          {/* Minute picker */}
          <Text
            style={[
              textStyles.inputHint,
              { fontSize: 11, marginBottom: spacing[3] },
            ]}
          >
            {t("minute")}
          </Text>
          <View style={{ flexDirection: "row" }}>
            {[0, 15, 30, 45].map((m) => (
              <TimeButton
                key={m}
                value={m}
                selected={m === selectedMinute}
                onPress={() => setSelectedMinute(m)}
              />
            ))}
          </View>
        </View>

        {/* Download calendar button - always enabled */}
        <View style={buttonContainer.inCardLarge}>
          <TouchableOpacity
            style={[
              buttonStyles.primary,
              isExporting && buttonStyles.primaryDisabled,
            ]}
            onPress={handleExportCalendar}
            disabled={isExporting}
            activeOpacity={0.85}
          >
            <DownloadIcon size={20} color={palette.dark.base} />
            <Text style={buttonStyles.primaryText}>
              {isExporting ? "..." : t("download_calendar")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hint text */}
      <Text
        style={[
          textStyles.inputHint,
          { marginTop: spacing[4], textAlign: "center" },
        ]}
      >
        {t("calendar_export_hint")}
      </Text>
    </View>
  );
};
