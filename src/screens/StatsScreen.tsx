import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
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
  getRecentLogsMixin,
} from "../stores";
import { ScreenBackground } from "../components/ScreenBackground";
import { getMonthName } from "../utils/history";
import { textStyles, spacing, layout, palette } from "../design";
import {
  RankingCard,
  StatsGrid,
  WeeklyCalendar,
  RecentActivity,
  AchievementsSection,
} from "../components/stats";
import { rankingMixin } from "@/stores/mixins";
import {
  PlayIcon,
  FireIcon,
  StrengthIcon,
  TrophyIcon,
  StarIcon,
  CrownIcon,
  ShareIcon,
} from "../components/Icons";

export const StatsScreen: React.FC = () => {
  const router = useRouter();

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
    getRecentLogs,
    ranking: { data: ranking },
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
      getRecentLogs: getRecentLogsMixin,
      ranking: rankingMixin,
    })
  );

  const monthlyCount = useMemo(() => getMonthlyCount(), [logs]);
  const recentLogs = useMemo(() => getRecentLogs(10), [logs]);
  const currentMonth = useMemo(
    () => getMonthName(new Date().getMonth(), language),
    [language]
  );

  const achievements = useMemo(
    () => [
      {
        icon: <PlayIcon size={20} color={palette.gold[500]} />,
        name: t("first_ceremony"),
        unlocked: completedCeremonies >= 1,
      },
      {
        icon: <FireIcon size={20} color={palette.gold[500]} />,
        name: t("seven_day_streak"),
        unlocked: longestStreak >= 7,
      },
      {
        icon: <StrengthIcon size={20} color={palette.gold[500]} />,
        name: t("thirty_day_streak"),
        unlocked: longestStreak >= 30,
      },
      {
        icon: <TrophyIcon size={20} color={palette.gold[500]} />,
        name: t("hundred_ceremonies"),
        unlocked: completedCeremonies >= 100,
      },
      {
        icon: <StarIcon size={20} color={palette.gold[500]} />,
        name: t("year_streak"),
        unlocked: longestStreak >= 365,
      },
      {
        icon: <CrownIcon size={20} color={palette.gold[500]} />,
        name: t("top_one_percent"),
        unlocked: ranking ? ranking.percentile >= 99 : false,
      },
    ],
    [completedCeremonies, longestStreak, ranking?.percentile, t]
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
          <View style={styles.header}>
            <View>
              <Text style={textStyles.label}>{t("your_progress")}</Text>
              <Text style={[textStyles.screenTitle, { marginTop: spacing[2] }]}>
                {t("statistics")}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => router.push("/share-badge")}
            >
              <ShareIcon size={20} color={palette.gold[500]} />
              <Text style={styles.shareButtonText}>{t("share_stats")}</Text>
            </TouchableOpacity>
          </View>

          {ranking && <RankingCard t={t as any} ranking={ranking} />}

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

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing[9],
    paddingTop: spacing[9],
    paddingBottom: spacing[10],
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    backgroundColor: palette.gold[100],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.gold[200],
  },
  shareButtonText: {
    color: palette.gold[500],
    fontWeight: "600",
    fontSize: 12,
  },
});
