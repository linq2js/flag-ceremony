/**
 * StatToggle - Toggle switches for which stats to show on badge
 */

import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { palette, spacing, textStyles, cardStyles } from "../../design";

interface StatToggleProps {
  showTotal: boolean;
  showCurrentStreak: boolean;
  showLongestStreak: boolean;
  showRanking: boolean;
  showMemberSince: boolean;
  onToggle: (
    stat:
      | "showTotal"
      | "showCurrentStreak"
      | "showLongestStreak"
      | "showRanking"
      | "showMemberSince"
  ) => void;
  t: (key: string) => string;
  hasRanking: boolean;
}

export const StatToggle: React.FC<StatToggleProps> = ({
  showTotal,
  showCurrentStreak,
  showLongestStreak,
  showRanking,
  showMemberSince,
  onToggle,
  t,
  hasRanking,
}) => {
  const stats = [
    { key: "showTotal" as const, label: t("total_ceremonies_label"), value: showTotal },
    { key: "showCurrentStreak" as const, label: t("current_streak_label"), value: showCurrentStreak },
    { key: "showLongestStreak" as const, label: t("longest_streak_label"), value: showLongestStreak },
    { key: "showRanking" as const, label: t("ranking_label"), value: showRanking, disabled: !hasRanking },
    { key: "showMemberSince" as const, label: t("member_since_label"), value: showMemberSince },
  ];

  return (
    <View style={styles.container}>
      <Text style={[textStyles.inputLabel, { marginBottom: spacing[4] }]}>
        {t("show_stats")}
      </Text>
      <View style={[cardStyles.default, styles.card]}>
        {stats.map((stat, index) => (
          <View
            key={stat.key}
            style={[
              styles.row,
              index < stats.length - 1 && styles.rowBorder,
            ]}
          >
            <Text
              style={[
                styles.label,
                stat.disabled && styles.labelDisabled,
              ]}
            >
              {stat.label}
            </Text>
            <Switch
              value={stat.value}
              onValueChange={() => onToggle(stat.key)}
              disabled={stat.disabled}
              trackColor={{
                false: palette.white[10],
                true: palette.gold[400],
              }}
              thumbColor={stat.value ? palette.gold[500] : palette.white[40]}
              ios_backgroundColor={palette.white[10]}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  card: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing[4],
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: palette.white[6],
  },
  label: {
    ...textStyles.body,
    color: palette.white[70],
  },
  labelDisabled: {
    color: palette.white[30],
  },
});

