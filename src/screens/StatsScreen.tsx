import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore, mixins } from "storion/react";
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
import { ScreenBackground } from "../components/ScreenBackground";
import { getMonthName } from "../utils/history";
import { textStyles, spacing, layout } from "../design";
import {
  RankingCard,
  StatsGrid,
  WeeklyCalendar,
  RecentActivity,
  AchievementsSection,
} from "../components/stats";

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
  } = useStore(
    mixins({
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
    })
  );

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
      <SafeAreaView
        testID="stats-screen"
        accessibilityLabel="stats-screen"
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
            <Text style={textStyles.label}>{t("your_progress")}</Text>
            <Text style={[textStyles.screenTitle, { marginTop: spacing[2] }]}>
              {t("statistics")}
            </Text>
          </View>

          <RankingCard t={t as any} ranking={ranking} />

          <StatsGrid
            t={t as any}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            monthlyCount={monthlyCount}
            currentMonth={currentMonth}
            completedCeremonies={completedCeremonies}
            totalCeremonies={totalCeremonies}
          />

          <WeeklyCalendar t={t as any} dayNames={dayNames} logs={logs} />

          <RecentActivity
            t={t as any}
            language={language}
            recentLogs={recentLogs}
          />

          <AchievementsSection t={t as any} achievements={achievements} />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};
