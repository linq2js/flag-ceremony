import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore, mixins } from "storion/react";
import {
  tMixin,
  languageMixin,
  currentStreakMixin,
  logsMixin,
  getThisWeekCountMixin,
  getTodayCompletedCountMixin,
  getTodayIncompleteCountMixin,
  nicknameMixin,
} from "../stores";
import { VietnamFlag } from "../components/VietnamFlag";
import { StatsCard } from "../components/StatsCard";
import { ScreenBackground } from "../components/ScreenBackground";
import { getHistoricalEvents, formatDate } from "../utils/history";
import {
  palette,
  textStyles,
  spacing,
  layout,
  cardStyles,
  cardPadding,
  iconContainer,
  getShadow,
  shadows,
  glassEffect,
  decorativeOrb,
  getStatusColors,
  type StatusVariant,
} from "../design";

const { width: screenWidth } = Dimensions.get("window");

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const {
    t,
    language,
    currentStreak,
    logs,
    getThisWeekCount,
    getTodayCompletedCount,
    getTodayIncompleteCount,
    nickname,
  } = useStore(
    mixins({
      t: tMixin,
      language: languageMixin,
      currentStreak: currentStreakMixin,
      logs: logsMixin,
      getThisWeekCount: getThisWeekCountMixin,
      getTodayCompletedCount: getTodayCompletedCountMixin,
      getTodayIncompleteCount: getTodayIncompleteCountMixin,
      nickname: nicknameMixin,
    })
  );

  const historicalEvents = useMemo(
    () => getHistoricalEvents(language),
    [language]
  );
  const todayFormatted = useMemo(
    () => formatDate(new Date(), language),
    [language]
  );
  const completedToday = useMemo(() => getTodayCompletedCount(), [logs]);
  const incompleteToday = useMemo(() => getTodayIncompleteCount(), [logs]);
  const thisWeekCount = useMemo(() => getThisWeekCount(), [logs]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    let timeGreeting: string;
    if (hour < 12) timeGreeting = t("good_morning");
    else if (hour < 17) timeGreeting = t("good_afternoon");
    else timeGreeting = t("good_evening");

    // Add nickname if available
    if (nickname) {
      return `${timeGreeting}, ${nickname}`;
    }
    return timeGreeting;
  }, [t, nickname]);

  const streakMessage = useMemo(() => {
    if (currentStreak === 0) return t("streak_zero");
    if (currentStreak < 7) return t("streak_low", { count: currentStreak });
    if (currentStreak < 30) return t("streak_medium", { count: currentStreak });
    return t("streak_high", { count: currentStreak });
  }, [currentStreak, t]);

  // Determine status variant based on ceremony completion
  const statusVariant: StatusVariant = useMemo(() => {
    if (completedToday > 0) return "success";
    if (incompleteToday > 0) return "warning";
    return "gold";
  }, [completedToday, incompleteToday]);

  const statusColors = getStatusColors(statusVariant);

  const statusEmoji =
    completedToday > 0 ? "✅" : incompleteToday > 0 ? "⏸️" : "🎯";
  const statusTitle =
    completedToday > 0
      ? completedToday === 1
        ? t("finished_ceremony_today")
        : t("finished_ceremonies_today", { count: completedToday })
      : incompleteToday > 0
      ? t("try_complete_ceremony")
      : t("ready_for_ceremony");
  const statusSubtitle =
    incompleteToday > 0 && completedToday === 0
      ? t("try_complete_desc")
      : t("tap_to_start_another");

  return (
    <ScreenBackground>
      <SafeAreaView
        testID="home-screen"
        accessibilityLabel="home-screen"
        style={layout.screenContent}
        edges={["top"]}
      >
        <ScrollView
          style={layout.screenContent}
          contentContainerStyle={layout.scrollContentLarge}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              paddingHorizontal: spacing[9],
              paddingTop: spacing[9],
              paddingBottom: spacing[5],
            }}
          >
            <Text style={textStyles.label} numberOfLines={1}>
              {greeting}
            </Text>
            <Text
              testID="app-title"
              accessibilityLabel="app-title"
              style={[textStyles.screenTitle, { marginTop: spacing[2] }]}
              numberOfLines={1}
            >
              {t("app_name")}
            </Text>
            <Text
              style={[textStyles.sublabel, { marginTop: spacing[2] }]}
              numberOfLines={1}
            >
              {todayFormatted}
            </Text>
          </View>

          {/* Hero Vietnam Flag */}
          <View
            testID="vietnam-flag"
            accessibilityLabel="vietnam-flag"
            style={[layout.centered, { paddingVertical: spacing[10] }]}
          >
            <View style={getShadow(shadows.crimson)}>
              <VietnamFlag
                width={Math.min(screenWidth - 64, 280)}
                height={Math.min(screenWidth - 64, 280) * 0.67}
                animated
              />
            </View>
          </View>

          {/* Status Card - Always tappable */}
          <TouchableOpacity
            testID="status-card"
            accessibilityLabel="status-card"
            onPress={() => router.push("/ceremony")}
            activeOpacity={0.9}
            style={[layout.container, { marginBottom: spacing[9] }]}
          >
            <View
              // @ts-ignore - glassEffect contains web-only props
              style={[
                cardStyles.default,
                {
                  backgroundColor: statusColors.bg,
                  borderColor: statusColors.border,
                  padding: spacing[9],
                  flexDirection: "row",
                  alignItems: "center",
                },
                glassEffect,
              ]}
            >
              {/* Decorative orb */}
              <View
                style={decorativeOrb(statusColors.solid, 100, {
                  top: -20,
                  right: -20,
                })}
              />

              {/* Icon */}
              <View
                style={[
                  iconContainer.xlarge,
                  {
                    backgroundColor: statusColors.bg,
                    borderWidth: 1,
                    borderColor: statusColors.border,
                    marginRight: spacing[7],
                  },
                ]}
              >
                <Text style={{ fontSize: 28 }}>{statusEmoji}</Text>
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text
                  style={[textStyles.cardTitle, { color: statusColors.text }]}
                  numberOfLines={1}
                >
                  {statusTitle}
                </Text>
                <Text
                  style={[
                    textStyles.bodySmall,
                    { color: statusColors.textMuted, marginTop: spacing[1] },
                  ]}
                  numberOfLines={1}
                >
                  {statusSubtitle}
                </Text>
              </View>

              {/* Arrow */}
              <Text style={{ fontSize: 24, color: statusColors.textMuted }}>
                →
              </Text>
            </View>
          </TouchableOpacity>

          {/* Stats Row */}
          <View
            style={[
              layout.cardRow,
              layout.container,
              { marginBottom: spacing[10] },
            ]}
          >
            <StatsCard
              testID="streak-stat"
              icon="🔥"
              label={t("current_streak")}
              value={currentStreak}
              sublabel={t("days")}
              color="gold"
            />
            <StatsCard
              testID="week-stat"
              icon="📅"
              label={t("this_week")}
              value={thisWeekCount}
              sublabel={t("ceremonies")}
              color="crimson"
            />
          </View>

          {/* History - temporarily hidden */}
          {/* <View
            testID="history-card"
            accessibilityLabel="history-card"
            style={{ marginBottom: spacing[10] }}
          >
            <HistoryCard
              events={historicalEvents}
              date={todayFormatted}
              title={t("this_day_in_history")}
            />
          </View> */}

          {/* Motivation */}
          <View
            // @ts-ignore - glassEffect contains web-only props
            style={[
              cardStyles.default,
              {
                marginHorizontal: spacing[7],
                marginTop: spacing[10],
                padding: cardPadding.lg,
              },
              glassEffect,
            ]}
          >
            {/* Decorative orb */}
            <View
              style={decorativeOrb(palette.gold[500], 100, {
                bottom: -30,
                right: -30,
              })}
            />

            <Text style={{ fontSize: 32, marginBottom: spacing[6] }}>💪</Text>
            <Text
              style={[textStyles.sectionTitle, { marginBottom: spacing[4] }]}
              numberOfLines={1}
            >
              {t("keep_streak_going")}
            </Text>
            <Text style={textStyles.body}>{streakMessage}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};
