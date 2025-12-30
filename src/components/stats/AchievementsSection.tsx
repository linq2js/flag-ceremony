import React from "react";
import { View, Text } from "react-native";
import {
  layout,
  spacing,
  cardStyles,
  cardPadding,
  badge,
  glassEffect,
  palette,
  textStyles,
} from "../../design";

interface Achievement {
  icon: React.ReactNode;
  name: string;
  unlocked: boolean;
}

interface AchievementsSectionProps {
  t: (key: string, params?: Record<string, unknown>) => string;
  achievements: Achievement[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  t,
  achievements,
}) => {
  return (
    <View style={layout.container}>
      <Text style={[textStyles.sectionTitle, { marginBottom: spacing[7] }]}>
        {t("achievements")}
      </Text>
      <View
        // @ts-ignore - glassEffect contains web-only props
        style={[cardStyles.default, { padding: cardPadding.sm }, glassEffect]}
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
              <View style={{ marginRight: spacing[3], opacity: achievement.unlocked ? 1 : 0.5 }}>
                {achievement.icon}
              </View>
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
  );
};

