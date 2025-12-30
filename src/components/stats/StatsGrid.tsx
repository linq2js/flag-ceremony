import React from "react";
import { View } from "react-native";
import { layout, spacing, palette } from "../../design";
import { StatsCard } from "../StatsCard";
import {
  FireIcon,
  TrophyIcon,
  CalendarIcon,
  CheckIcon,
  StatsIcon,
  TargetIcon,
} from "../Icons";

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
  // Guard against NaN/undefined values from potentially corrupted persisted data
  const safeCurrentStreak = currentStreak || 0;
  const safeLongestStreak = longestStreak || 0;
  const safeCompleted = completedCeremonies || 0;
  const safeTotal = totalCeremonies || 0;
  const safeIncomplete = Math.max(0, safeTotal - safeCompleted);

  return (
    <View style={[layout.container, { marginBottom: spacing[10] }]}>
      <View style={[layout.cardRow, { marginBottom: spacing[5] }]}>
        <StatsCard
          icon={<FireIcon size={28} color={palette.gold[500]} />}
          label={t("current_streak")}
          value={safeCurrentStreak}
          sublabel={t("consecutive_days")}
          color="gold"
        />
        <StatsCard
          icon={<TrophyIcon size={28} color="#f87171" />}
          label={t("best_streak")}
          value={safeLongestStreak}
          sublabel={t("your_record")}
          color="crimson"
        />
      </View>
      <View style={layout.cardRow}>
        <StatsCard
          icon={<CalendarIcon size={28} color={palette.white[70]} />}
          label={currentMonth}
          value={monthlyCount}
          sublabel={t("ceremonies")}
          color="white"
        />
        <StatsCard
          icon={<CheckIcon size={28} color={palette.gold[500]} />}
          label={t("completed")}
          value={safeCompleted}
          sublabel={t("all_time")}
          color="gold"
        />
      </View>
      <View style={[layout.cardRow, { marginTop: spacing[5] }]}>
        <StatsCard
          icon={<StatsIcon size={28} color={palette.white[70]} />}
          label={t("total_attempts")}
          value={safeTotal}
          sublabel={t("all_time")}
          color="white"
        />
        <StatsCard
          icon={<TargetIcon size={28} color="#f87171" />}
          label={t("incomplete")}
          value={safeIncomplete}
          sublabel={t("exited_early")}
          color="crimson"
        />
      </View>
    </View>
  );
};

