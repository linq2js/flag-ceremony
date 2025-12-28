import React from "react";
import { View } from "react-native";
import { layout, spacing } from "../../design";
import { StatsCard } from "../StatsCard";

interface StatsGridProps {
  t: (key: string, params?: Record<string, unknown>) => string;
  currentStreak: number;
  longestStreak: number;
  monthlyCount: number;
  currentMonth: string;
  completedCeremonies: number;
  totalCeremonies: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  t,
  currentStreak,
  longestStreak,
  monthlyCount,
  currentMonth,
  completedCeremonies,
  totalCeremonies,
}) => {
  return (
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
  );
};

