/**
 * BadgeTypeSelector - Horizontal scroll selector for badge types
 */

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { BadgeType, BADGE_TYPES } from "../../stores/badge";
import { palette, spacing, cardStyles, textStyles } from "../../design";

interface BadgeTypeSelectorProps {
  selected: BadgeType;
  onSelect: (type: BadgeType) => void;
  t: (key: string) => string;
}

const BADGE_EMOJIS: Record<BadgeType, string> = {
  minimalist: "⬜",
  achievement: "🎖️",
  streak: "🔥",
  patriot: "🪪",
  social: "📱",
  certificate: "📜",
};

export const BadgeTypeSelector: React.FC<BadgeTypeSelectorProps> = ({
  selected,
  onSelect,
  t,
}) => {
  const badges = Object.entries(BADGE_TYPES) as [BadgeType, typeof BADGE_TYPES[BadgeType]][];

  return (
    <View style={styles.container}>
      <Text style={[textStyles.inputLabel, { marginBottom: spacing[4] }]}>
        {t("badge_type")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {badges.map(([type, info]) => {
          const isSelected = type === selected;
          return (
            <TouchableOpacity
              key={type}
              style={[
                cardStyles.default,
                styles.badge,
                isSelected && styles.badgeSelected,
              ]}
              onPress={() => onSelect(type)}
            >
              <Text style={styles.emoji}>{BADGE_EMOJIS[type]}</Text>
              <Text
                style={[
                  styles.badgeName,
                  isSelected && styles.badgeNameSelected,
                ]}
              >
                {t(`badge_type_${type}`)}
              </Text>
              <Text style={styles.badgeRatio}>
                {info.aspectRatio === 1
                  ? "1:1"
                  : info.aspectRatio > 1
                  ? "16:10"
                  : "9:16"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  scrollContent: {
    paddingHorizontal: spacing[1],
    gap: spacing[3],
  },
  badge: {
    alignItems: "center",
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    minWidth: 90,
  },
  badgeSelected: {
    borderColor: palette.gold[500],
    borderWidth: 2,
    backgroundColor: palette.gold[50],
  },
  emoji: {
    fontSize: 24,
    marginBottom: spacing[2],
  },
  badgeName: {
    ...textStyles.bodySmall,
    color: palette.white[60],
    fontWeight: "600",
    textAlign: "center",
  },
  badgeNameSelected: {
    color: palette.gold[500],
  },
  badgeRatio: {
    ...textStyles.time,
    marginTop: spacing[1],
  },
});

