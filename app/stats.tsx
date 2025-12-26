import React, { useMemo } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../src/store";
import { StatsCard } from "../src/components/StatsCard";
import { ScreenBackground } from "../src/components/ScreenBackground";
import { formatDate, formatTime, getMonthName } from "../src/utils/history";
import { t, getDayNames } from "../src/i18n";

const glassStyle = Platform.select({
  web: { backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" },
  default: {},
});

export default function StatsScreen() {
  const {
    currentStreak,
    longestStreak,
    totalCeremonies,
    completedCeremonies,
    logs,
    language,
    getMonthlyCount,
    getRanking,
    getRecentLogs,
  } = useAppStore((s, a) => ({
    currentStreak: s.currentStreak,
    longestStreak: s.longestStreak,
    totalCeremonies: s.totalCeremonies,
    completedCeremonies: s.completedCeremonies,
    logs: s.logs,
    language: s.language,
    getMonthlyCount: a.getMonthlyCount,
    getRanking: a.getRanking,
    getRecentLogs: a.getRecentLogs,
  }));

  const monthlyCount = useMemo(() => getMonthlyCount(), [logs]);
  const ranking = useMemo(() => getRanking(), [completedCeremonies]);
  const recentLogs = useMemo(() => getRecentLogs(10), [logs]);
  const currentMonth = useMemo(
    () => getMonthName(new Date().getMonth(), language),
    [language]
  );
  const dayNames = useMemo(() => getDayNames(language), [language]);

  // Achievements based on COMPLETED ceremonies only
  const achievements = useMemo(
    () => [
      {
        icon: "🌅",
        name: t(language, "first_ceremony"),
        unlocked: completedCeremonies >= 1,
      },
      {
        icon: "🔥",
        name: t(language, "seven_day_streak"),
        unlocked: longestStreak >= 7,
      },
      {
        icon: "💪",
        name: t(language, "thirty_day_streak"),
        unlocked: longestStreak >= 30,
      },
      {
        icon: "🏆",
        name: t(language, "hundred_ceremonies"),
        unlocked: completedCeremonies >= 100,
      },
      {
        icon: "⭐",
        name: t(language, "year_streak"),
        unlocked: longestStreak >= 365,
      },
      {
        icon: "👑",
        name: t(language, "top_one_percent"),
        unlocked: ranking.percentile >= 99,
      },
    ],
    [completedCeremonies, longestStreak, ranking.percentile, language]
  );

  return (
    <ScreenBackground>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#fbbf24",
                textTransform: "uppercase",
                letterSpacing: 4,
                fontWeight: "600",
              }}
            >
              {t(language, "your_progress")}
            </Text>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "800",
                color: "#ffffff",
                marginTop: 6,
              }}
            >
              {t(language, "statistics")}
            </Text>
          </View>

          {/* Ranking Card */}
          <View
            // @ts-ignore
            style={[
              {
                marginHorizontal: 16,
                marginBottom: 24,
                borderRadius: 28,
                padding: 24,
                backgroundColor: "rgba(251, 191, 36, 0.06)",
                borderWidth: 1,
                borderColor: "rgba(251, 191, 36, 0.15)",
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
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: "#fbbf24",
                opacity: 0.1,
              }}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 24,
                  backgroundColor: "rgba(251, 191, 36, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 20,
                  borderWidth: 1,
                  borderColor: "rgba(251, 191, 36, 0.3)",
                }}
              >
                <Text style={{ fontSize: 40 }}>🏆</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 10,
                    color: "rgba(251, 191, 36, 0.7)",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    fontWeight: "700",
                  }}
                >
                  {t(language, "your_ranking")}
                </Text>
                <Text
                  style={{
                    fontSize: 40,
                    fontWeight: "800",
                    color: "#fbbf24",
                    marginTop: 4,
                  }}
                >
                  #{ranking.rank.toLocaleString()}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "rgba(251, 191, 36, 0.6)",
                    marginTop: 4,
                  }}
                >
                  {t(language, "top_percent", { percent: ranking.percentile })}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
              <StatsCard
                icon="🔥"
                label={t(language, "current_streak")}
                value={currentStreak}
                sublabel={t(language, "consecutive_days")}
                color="gold"
              />
              <StatsCard
                icon="⭐"
                label={t(language, "best_streak")}
                value={longestStreak}
                sublabel={t(language, "your_record")}
                color="crimson"
              />
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <StatsCard
                icon="📅"
                label={currentMonth}
                value={monthlyCount}
                sublabel={t(language, "ceremonies")}
                color="white"
              />
              <StatsCard
                icon="📊"
                label={t(language, "completed")}
                value={completedCeremonies}
                sublabel={t(language, "all_time")}
                color="gold"
              />
            </View>
          </View>

          {/* Weekly Progress */}
          <View
            // @ts-ignore
            style={[
              {
                marginHorizontal: 16,
                marginBottom: 24,
                backgroundColor: "rgba(255,255,255,0.03)",
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.06)",
              },
              glassStyle,
            ]}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 20,
              }}
            >
              {t(language, "this_week_calendar")}
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {dayNames.map((day, index) => {
                const today = new Date();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay() + index);
                const dateStr = startOfWeek.toISOString().split("T")[0];
                // Only count completed ceremonies for the calendar
                const hasCompletedLog = logs.some(
                  (log) => log.date === dateStr && log.completed
                );
                const isToday = dateStr === today.toISOString().split("T")[0];
                const isFuture = startOfWeek > today;

                return (
                  <View key={index} style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.4)",
                        fontWeight: "600",
                        marginBottom: 10,
                      }}
                    >
                      {day}
                    </Text>
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: hasCompletedLog
                          ? "rgba(34, 197, 94, 0.9)"
                          : isToday
                          ? "rgba(251, 191, 36, 0.15)"
                          : "rgba(255,255,255,0.04)",
                        borderWidth: isToday && !hasCompletedLog ? 2 : 1,
                        borderColor: hasCompletedLog
                          ? "rgba(34, 197, 94, 0.5)"
                          : isToday
                          ? "rgba(251, 191, 36, 0.5)"
                          : "rgba(255,255,255,0.06)",
                      }}
                    >
                      {hasCompletedLog ? (
                        <Text style={{ fontSize: 18, color: "#ffffff" }}>
                          ✓
                        </Text>
                      ) : (
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: isToday ? "700" : "500",
                            color: isToday
                              ? "#fbbf24"
                              : isFuture
                              ? "rgba(255,255,255,0.2)"
                              : "rgba(255,255,255,0.4)",
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
          <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              {t(language, "recent_activity")}
            </Text>
            {recentLogs.length === 0 ? (
              <View
                // @ts-ignore
                style={[
                  {
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: 24,
                    padding: 40,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.06)",
                  },
                  glassStyle,
                ]}
              >
                <Text style={{ fontSize: 56, marginBottom: 16 }}>🇻🇳</Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.5)",
                    textAlign: "center",
                  }}
                >
                  {t(language, "no_ceremonies_yet")}
                </Text>
              </View>
            ) : (
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
                {recentLogs.map((log, index) => (
                  <View
                    key={log.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 16,
                      borderTopWidth: index > 0 ? 1 : 0,
                      borderTopColor: "rgba(255,255,255,0.04)",
                      opacity: log.completed ? 1 : 0.6,
                    }}
                  >
                    <View
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 15,
                        backgroundColor: log.completed
                          ? "rgba(34, 197, 94, 0.12)"
                          : "rgba(255, 255, 255, 0.08)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 14,
                        borderWidth: 1,
                        borderColor: log.completed
                          ? "rgba(34, 197, 94, 0.2)"
                          : "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <Text style={{ fontSize: 24 }}>
                        {log.completed ? "✅" : "⏹️"}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "600",
                          color: "#ffffff",
                        }}
                      >
                        {log.completed
                          ? t(language, "flag_ceremony")
                          : t(language, "incomplete_ceremony")}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: "rgba(255,255,255,0.4)",
                          marginTop: 3,
                        }}
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
                            ? "#4ade80"
                            : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {Math.floor(log.duration / 60)}:
                        {String(log.duration % 60).padStart(2, "0")}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.3)",
                          marginTop: 3,
                        }}
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
          <View style={{ marginHorizontal: 16 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              {t(language, "achievements")}
            </Text>
            <View
              // @ts-ignore
              style={[
                {
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: 24,
                  padding: 18,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.06)",
                },
                glassStyle,
              ]}
            >
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {achievements.map((achievement, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: achievement.unlocked
                        ? "rgba(251, 191, 36, 0.12)"
                        : "rgba(255,255,255,0.02)",
                      borderWidth: 1,
                      borderColor: achievement.unlocked
                        ? "rgba(251, 191, 36, 0.25)"
                        : "rgba(255,255,255,0.04)",
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      opacity: achievement.unlocked ? 1 : 0.5,
                    }}
                  >
                    <Text style={{ fontSize: 20, marginRight: 8 }}>
                      {achievement.icon}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: achievement.unlocked
                          ? "#fbbf24"
                          : "rgba(255,255,255,0.5)",
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
}
