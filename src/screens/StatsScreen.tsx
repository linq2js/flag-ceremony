import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore } from "storion/react";
import {
  tMixin,
  languageMixin,
  dayNamesMixin,
  currentStreakMixin,
  longestStreakMixin,
  totalCeremoniesMixin,
  completedCeremoniesMixin,
  logsMixin,
  getMonthlyCountMixin,
  getRankingMixin,
  getRecentLogsMixin,
} from "../store";
import { StatsCard } from "../components/StatsCard";
import { ScreenBackground } from "../components/ScreenBackground";
import { formatDate, formatTime, getMonthName } from "../utils/history";
import {
  colors,
  palette,
  textStyles,
  spacing,
  layout,
  cardStyles,
  cardPadding,
  iconContainer,
  listItem,
  listItemDivider,
  badge,
  calendarDay,
  glassEffect,
  decorativeOrb,
} from "../design";

export const StatsScreen: React.FC = () => {
  const {
    t,
    language,
    dayNames,
    currentStreak,
    longestStreak,
    totalCeremonies,
    completedCeremonies,
    logs,
    getMonthlyCount,
    getRanking,
    getRecentLogs,
  } = useStore({
    t: tMixin,
    language: languageMixin,
    dayNames: dayNamesMixin,
    currentStreak: currentStreakMixin,
    longestStreak: longestStreakMixin,
    totalCeremonies: totalCeremoniesMixin,
    completedCeremonies: completedCeremoniesMixin,
    logs: logsMixin,
    getMonthlyCount: getMonthlyCountMixin,
    getRanking: getRankingMixin,
    getRecentLogs: getRecentLogsMixin,
  });

  const monthlyCount = useMemo(() => getMonthlyCount(), [logs]);
  const ranking = useMemo(() => getRanking(), [completedCeremonies]);
  const recentLogs = useMemo(() => getRecentLogs(10), [logs]);
  const currentMonth = useMemo(
    () => getMonthName(new Date().getMonth(), language),
    [language]
  );

  const achievements = useMemo(
    () => [
      {
        icon: "🌅",
        name: t("first_ceremony"),
        unlocked: completedCeremonies >= 1,
      },
      {
        icon: "🔥",
        name: t("seven_day_streak"),
        unlocked: longestStreak >= 7,
      },
      {
        icon: "💪",
        name: t("thirty_day_streak"),
        unlocked: longestStreak >= 30,
      },
      {
        icon: "🏆",
        name: t("hundred_ceremonies"),
        unlocked: completedCeremonies >= 100,
      },
      {
        icon: "⭐",
        name: t("year_streak"),
        unlocked: longestStreak >= 365,
      },
      {
        icon: "👑",
        name: t("top_one_percent"),
        unlocked: ranking.percentile >= 99,
      },
    ],
    [completedCeremonies, longestStreak, ranking.percentile, t]
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
            <Text style={textStyles.label}>{t("your_progress")}</Text>
            <Text style={[textStyles.screenTitle, { marginTop: spacing[2] }]}>
              {t("statistics")}
            </Text>
          </View>

          {/* Ranking Card */}
          <View
            // @ts-ignore
            style={[
              cardStyles.goldFeatured,
              { marginHorizontal: spacing[7], marginBottom: spacing[10] },
              glassEffect,
            ]}
          >
            <View
              style={decorativeOrb(palette.gold[500], 160, {
                top: -40,
                right: -40,
              })}
            />
            <View style={layout.row}>
              <View
                style={[
                  iconContainer.featured,
                  {
                    backgroundColor: palette.gold[150],
                    borderWidth: 1,
                    borderColor: palette.gold[300],
                    marginRight: spacing[9],
                  },
                ]}
              >
                <Text style={{ fontSize: 40 }}>🏆</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 10,
                    color: palette.gold[700],
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    fontWeight: "700",
                  }}
                >
                  {t("your_ranking")}
                </Text>
                <Text
                  style={[textStyles.rankingValue, { marginTop: spacing[1] }]}
                >
                  #{ranking.rank.toLocaleString()}
                </Text>
                <Text
                  style={[
                    textStyles.sublabel,
                    { color: palette.gold[600], marginTop: spacing[1] },
                  ]}
                >
                  {t("top_percent", { percent: ranking.percentile })}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={[layout.container, { marginBottom: spacing[10] }]}>
            <View style={[layout.cardRow, { marginBottom: spacing[5] }]}>
              <StatsCard
                icon="🔥"
                label={t("current_streak")}
                value={currentStreak}
                sublabel={t("consecutive_days")}
                color="gold"
              />
              <StatsCard
                icon="⭐"
                label={t("best_streak")}
                value={longestStreak}
                sublabel={t("your_record")}
                color="crimson"
              />
            </View>
            <View style={layout.cardRow}>
              <StatsCard
                icon="📅"
                label={currentMonth}
                value={monthlyCount}
                sublabel={t("ceremonies")}
                color="white"
              />
              <StatsCard
                icon="✅"
                label={t("completed")}
                value={completedCeremonies}
                sublabel={t("all_time")}
                color="gold"
              />
            </View>
            <View style={[layout.cardRow, { marginTop: spacing[5] }]}>
              <StatsCard
                icon="📊"
                label={t("total_attempts")}
                value={totalCeremonies}
                sublabel={t("all_time")}
                color="white"
              />
              <StatsCard
                icon="⏹️"
                label={t("incomplete")}
                value={totalCeremonies - completedCeremonies}
                sublabel={t("exited_early")}
                color="crimson"
              />
            </View>
          </View>

          {/* Weekly Calendar */}
          <View
            // @ts-ignore
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
            <Text
              style={[textStyles.sectionTitle, { marginBottom: spacing[9] }]}
            >
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
                      style={[
                        textStyles.statLabel,
                        { marginBottom: spacing[4] },
                      ]}
                    >
                      {day}
                    </Text>
                    <View style={[calendarDay.cell, cellStyle]}>
                      {hasCompletedLog ? (
                        <Text
                          style={{ fontSize: 18, color: colors.text.primary }}
                        >
                          ✓
                        </Text>
                      ) : (
                        <Text
                          style={{
                            fontSize: 14,
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

          {/* Recent Activity */}
          <View style={[layout.container, { marginBottom: spacing[10] }]}>
            <Text
              style={[textStyles.sectionTitle, { marginBottom: spacing[7] }]}
            >
              {t("recent_activity")}
            </Text>
            {recentLogs.length === 0 ? (
              <View
                // @ts-ignore
                style={[
                  cardStyles.default,
                  { padding: spacing[14], alignItems: "center" },
                  glassEffect,
                ]}
              >
                <Text style={{ fontSize: 56, marginBottom: spacing[7] }}>
                  🇻🇳
                </Text>
                <Text style={[textStyles.body, { textAlign: "center" }]}>
                  {t("no_ceremonies_yet")}
                </Text>
              </View>
            ) : (
              <View
                // @ts-ignore
                style={[cardStyles.list, glassEffect]}
              >
                {recentLogs.map((log, index) => (
                  <View
                    key={log.id}
                    style={[
                      listItem,
                      index > 0 && listItemDivider,
                      { opacity: log.completed ? 1 : 0.6 },
                    ]}
                  >
                    <View
                      style={[
                        iconContainer.large,
                        {
                          backgroundColor: log.completed
                            ? palette.green[100]
                            : palette.white[8],
                          borderWidth: 1,
                          borderColor: log.completed
                            ? palette.green[200]
                            : palette.white[10],
                          marginRight: spacing[6],
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 24 }}>
                        {log.completed ? "✅" : "⏹️"}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={textStyles.inputLabel}>
                        {log.completed
                          ? t("flag_ceremony")
                          : t("incomplete_ceremony")}
                      </Text>
                      <Text
                        style={[
                          textStyles.bodySmall,
                          { marginTop: spacing[1] },
                        ]}
                      >
                        {formatDate(new Date(log.date), language)}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: log.completed
                            ? palette.green.light
                            : palette.white[40],
                        }}
                      >
                        {Math.floor(log.duration / 60)}:
                        {String(log.duration % 60).padStart(2, "0")}
                      </Text>
                      <Text
                        style={[textStyles.time, { marginTop: spacing[1] }]}
                      >
                        {formatTime(new Date(log.completedAt), language)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Achievements */}
          <View style={layout.container}>
            <Text
              style={[textStyles.sectionTitle, { marginBottom: spacing[7] }]}
            >
              {t("achievements")}
            </Text>
            <View
              // @ts-ignore
              style={[
                cardStyles.default,
                { padding: cardPadding.sm },
                glassEffect,
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: spacing[4],
                }}
              >
                {achievements.map((achievement, index) => (
                  <View
                    key={index}
                    style={[
                      badge.base,
                      achievement.unlocked ? badge.unlocked : badge.locked,
                    ]}
                  >
                    <Text style={{ fontSize: 20, marginRight: spacing[3] }}>
                      {achievement.icon}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: achievement.unlocked
                          ? palette.gold[500]
                          : palette.white[50],
                      }}
                    >
                      {achievement.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};
