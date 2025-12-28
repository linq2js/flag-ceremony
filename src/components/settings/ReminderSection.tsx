import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  layout,
  spacing,
  cardStyles,
  glassEffect,
  palette,
  textStyles,
} from "../../design";
import { SectionHeader } from "./SectionHeader";
import { TimeButton } from "./TimeButton";
import { DayButton } from "./DayButton";

interface ReminderSettings {
  time: string;
  days: number[];
}

interface ReminderSectionProps {
  t: (key: string, params?: Record<string, unknown>) => string;
  dayNames: string[];
  reminderSettings: ReminderSettings;
  isExporting: boolean;
  onTimeChange: (hours: number, minutes: number) => void;
  onDayToggle: (dayIndex: number) => void;
  onExportCalendar: () => void;
}

export const ReminderSection: React.FC<ReminderSectionProps> = ({
  t,
  dayNames,
  reminderSettings,
  isExporting,
  onTimeChange,
  onDayToggle,
  onExportCalendar,
}) => {
  const [hours, minutes] = reminderSettings.time.split(":").map(Number);

  return (
    <View style={[layout.container, { marginBottom: spacing[10] }]}>
      <SectionHeader icon="📅" title={t("daily_reminder")} />

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

        {/* Time picker */}
        <View
          style={{
            padding: spacing[8],
            borderBottomWidth: 1,
            borderBottomColor: palette.white[4],
          }}
        >
          <Text style={[textStyles.inputHint, { marginBottom: spacing[6] }]}>
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
                  onPress={() => onTimeChange(h, minutes)}
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
                  onPress={() => onTimeChange(hours, m)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Day picker */}
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

        {/* Download calendar button */}
        <TouchableOpacity
          style={{
            padding: spacing[8],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: palette.gold[500] + "20",
          }}
          onPress={onExportCalendar}
          disabled={isExporting || reminderSettings.days.length === 0}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 20, marginRight: spacing[3] }}>📥</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color:
                reminderSettings.days.length === 0
                  ? palette.white[30]
                  : palette.gold[400],
            }}
          >
            {isExporting ? "..." : t("download_calendar")}
          </Text>
        </TouchableOpacity>
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
