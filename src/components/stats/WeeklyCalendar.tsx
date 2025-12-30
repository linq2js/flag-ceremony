import React from "react";
import { View, Text } from "react-native";
import {
  colors,
  layout,
  spacing,
  cardStyles,
  cardPadding,
  calendarDay,
  glassEffect,
  palette,
  textStyles,
} from "../../design";

interface CeremonyLog {
  id: string;
  date: string;
  completed: boolean;
}

interface WeeklyCalendarProps {
  t: (key: string, params?: Record<string, unknown>) => string;
  dayNames: string[];
  logs: CeremonyLog[];
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  t,
  dayNames,
  logs,
}) => {
  return (
    <View
      // @ts-ignore - glassEffect contains web-only props
      style={[
        cardStyles.default,
        {
          marginHorizontal: spacing[7],
          marginBottom: spacing[10],
          padding: cardPadding.md,
        },
        glassEffect,
      ]}
    >
      <Text style={[textStyles.sectionTitle, { marginBottom: spacing[9] }]}>
        {t("this_week_calendar")}
      </Text>
      <View style={layout.rowBetween}>
        {dayNames.map((day, index) => {
          const today = new Date();
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay() + index);
          const dateStr = startOfWeek.toISOString().split("T")[0];
          const hasCompletedLog = logs.some(
            (log) => log.date === dateStr && log.completed
          );
          const isToday = dateStr === today.toISOString().split("T")[0];
          const isFuture = startOfWeek > today;

          const cellStyle = hasCompletedLog
            ? calendarDay.completed
            : isToday
            ? calendarDay.today
            : isFuture
            ? calendarDay.future
            : calendarDay.default;

          return (
            <View key={index} style={{ alignItems: "center" }}>
              <Text
                style={[textStyles.statLabel, { marginBottom: spacing[4] }]}
              >
                {day}
              </Text>
              <View style={[calendarDay.cell, cellStyle]}>
                {hasCompletedLog ? (
                  <Text style={{ fontSize: 15, color: colors.text.primary }}>
                    ✓
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: isToday ? "700" : "500",
                      color: isToday
                        ? palette.gold[500]
                        : isFuture
                        ? palette.white[20]
                        : palette.white[40],
                    }}
                  >
                    {startOfWeek.getDate()}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

