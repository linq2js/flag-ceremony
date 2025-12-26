import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../src/store";
import { VietnamFlag, VietnamFlagIcon } from "../src/components/VietnamFlag";
import { HistoryCard } from "../src/components/HistoryCard";
import { StatsCard } from "../src/components/StatsCard";
import { Button } from "../src/components/Button";
import { ScreenBackground } from "../src/components/ScreenBackground";
import { getHistoricalEvents, formatDate } from "../src/utils/history";
import { t } from "../src/i18n";

const { width: screenWidth } = Dimensions.get("window");

const glassStyle = Platform.select({
  web: { backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" },
  default: {},
});

export default function HomeScreen() {
  const router = useRouter();
  const { currentStreak, logs, language, getThisWeekCount, getTodayCompletedCount, getTodayIncompleteCount } = useAppStore(
    (s, a) => ({
      currentStreak: s.currentStreak,
      logs: s.logs,
      language: s.language,
      getThisWeekCount: a.getThisWeekCount,
      getTodayCompletedCount: a.getTodayCompletedCount,
      getTodayIncompleteCount: a.getTodayIncompleteCount,
    })
  );

  const historicalEvents = useMemo(() => getHistoricalEvents(language), [language]);
  const todayFormatted = useMemo(() => formatDate(new Date(), language), [language]);
  const completedToday = useMemo(() => getTodayCompletedCount(), [logs]);
  const incompleteToday = useMemo(() => getTodayIncompleteCount(), [logs]);
  const thisWeekCount = useMemo(() => getThisWeekCount(), [logs]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t(language, "good_morning");
    if (hour < 17) return t(language, "good_afternoon");
    return t(language, "good_evening");
  }, [language]);

  const streakMessage = useMemo(() => {
    if (currentStreak === 0) return t(language, "streak_zero");
    if (currentStreak < 7) return t(language, "streak_low", { count: currentStreak });
    if (currentStreak < 30) return t(language, "streak_medium", { count: currentStreak });
    return t(language, "streak_high", { count: currentStreak });
  }, [currentStreak, language]);

  return (
    <ScreenBackground>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 }}>
            <Text
              style={{
                fontSize: 12,
                color: "#fbbf24",
                textTransform: "uppercase",
                letterSpacing: 4,
                fontWeight: "600",
              }}
              numberOfLines={1}
            >
              {greeting}
            </Text>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "800",
                color: "#ffffff",
                marginTop: 6,
                letterSpacing: -0.5,
              }}
              numberOfLines={1}
            >
              {t(language, "app_name")}
            </Text>
            <Text
              style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 6 }}
              numberOfLines={1}
            >
              {todayFormatted}
            </Text>
          </View>

          {/* Hero Vietnam Flag */}
          <View style={{ alignItems: "center", paddingVertical: 24 }}>
            <View
              style={{
                shadowColor: "#dc2626",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 15,
              }}
            >
              <VietnamFlag
                width={Math.min(screenWidth - 64, 280)}
                height={Math.min(screenWidth - 64, 280) * 0.67}
                animated
              />
            </View>
          </View>

          {/* Status Card - Always tappable */}
          <TouchableOpacity
            onPress={() => router.push("/ceremony")}
            activeOpacity={0.9}
            style={{ paddingHorizontal: 16, marginBottom: 20 }}
          >
            <View
              // @ts-ignore
              style={[
                {
                  backgroundColor: completedToday > 0 
                    ? "rgba(34, 197, 94, 0.08)" 
                    : incompleteToday > 0
                    ? "rgba(251, 146, 60, 0.08)"
                    : "rgba(251, 191, 36, 0.08)",
                  borderWidth: 1,
                  borderColor: completedToday > 0 
                    ? "rgba(34, 197, 94, 0.25)" 
                    : incompleteToday > 0
                    ? "rgba(251, 146, 60, 0.25)"
                    : "rgba(251, 191, 36, 0.25)",
                  borderRadius: 24,
                  padding: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  overflow: "hidden",
                },
                glassStyle,
              ]}
            >
              <View
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: completedToday > 0 ? "#22c55e" : incompleteToday > 0 ? "#fb923c" : "#fbbf24",
                  opacity: 0.15,
                }}
              />
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  backgroundColor: completedToday > 0 
                    ? "rgba(34, 197, 94, 0.15)" 
                    : incompleteToday > 0
                    ? "rgba(251, 146, 60, 0.15)"
                    : "rgba(251, 191, 36, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                  borderWidth: 1,
                  borderColor: completedToday > 0 
                    ? "rgba(34, 197, 94, 0.3)" 
                    : incompleteToday > 0
                    ? "rgba(251, 146, 60, 0.3)"
                    : "rgba(251, 191, 36, 0.3)",
                }}
              >
                <Text style={{ fontSize: 28 }}>
                  {completedToday > 0 ? "✅" : incompleteToday > 0 ? "⏸️" : "🎯"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ 
                    fontSize: 18, 
                    fontWeight: "700", 
                    color: completedToday > 0 ? "#4ade80" : incompleteToday > 0 ? "#fb923c" : "#fbbf24" 
                  }}
                  numberOfLines={1}
                >
                  {completedToday > 0 
                    ? completedToday === 1
                      ? t(language, "finished_ceremony_today")
                      : t(language, "finished_ceremonies_today", { count: completedToday })
                    : incompleteToday > 0
                    ? t(language, "try_complete_ceremony")
                    : t(language, "ready_for_ceremony")}
                </Text>
                <Text
                  style={{ 
                    fontSize: 14, 
                    color: completedToday > 0 
                      ? "rgba(74, 222, 128, 0.7)" 
                      : incompleteToday > 0
                      ? "rgba(251, 146, 60, 0.7)"
                      : "rgba(251, 191, 36, 0.7)", 
                    marginTop: 4 
                  }}
                  numberOfLines={1}
                >
                  {incompleteToday > 0 && completedToday === 0
                    ? t(language, "try_complete_desc")
                    : t(language, "tap_to_start_another")}
                </Text>
              </View>
              <Text 
                style={{ 
                  fontSize: 24, 
                  color: completedToday > 0 
                    ? "rgba(74, 222, 128, 0.6)" 
                    : incompleteToday > 0
                    ? "rgba(251, 146, 60, 0.6)"
                    : "rgba(251, 191, 36, 0.6)" 
                }}
              >
                →
              </Text>
            </View>
          </TouchableOpacity>

          {/* Stats Row */}
          <View
            style={{ flexDirection: "row", paddingHorizontal: 16, gap: 12, marginBottom: 24 }}
          >
            <StatsCard
              icon="🔥"
              label={t(language, "current_streak")}
              value={currentStreak}
              sublabel={t(language, "days")}
              color="gold"
            />
            <StatsCard
              icon="📅"
              label={t(language, "this_week")}
              value={thisWeekCount}
              sublabel={t(language, "ceremonies")}
              color="crimson"
            />
          </View>

          {/* History */}
          <HistoryCard
            events={historicalEvents}
            date={todayFormatted}
            title={t(language, "this_day_in_history")}
          />

          {/* Motivation */}
          <View
            // @ts-ignore
            style={[
              {
                marginHorizontal: 16,
                marginTop: 24,
                backgroundColor: "rgba(255,255,255,0.03)",
                borderRadius: 24,
                padding: 24,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.06)",
                overflow: "hidden",
              },
              glassStyle,
            ]}
          >
            <View
              style={{
                position: "absolute",
                bottom: -30,
                right: -30,
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#fbbf24",
                opacity: 0.05,
              }}
            />
            <Text style={{ fontSize: 32, marginBottom: 14 }}>💪</Text>
            <Text
              style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 10 }}
              numberOfLines={1}
            >
              {t(language, "keep_streak_going")}
            </Text>
            <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 22 }}>
              {streakMessage}
            </Text>
          </View>

          {/* CTA Button */}
          <View style={{ paddingHorizontal: 16, marginTop: 28 }}>
            <Button
              title={t(language, "start_flag_ceremony")}
              icon={<VietnamFlagIcon size={22} />}
              onPress={() => router.push("/ceremony")}
              variant="primary"
              size="large"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}
