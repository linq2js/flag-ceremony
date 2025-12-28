import React from "react";
import { View, Text } from "react-native";
import {
  layout,
  spacing,
  cardStyles,
  iconContainer,
  glassEffect,
  palette,
  textStyles,
  decorativeOrb,
} from "../../design";

interface RankingCardProps {
  t: (key: string, params?: Record<string, unknown>) => string;
  ranking: { rank: number; percentile: number };
}

export const RankingCard: React.FC<RankingCardProps> = ({ t, ranking }) => {
  return (
    <View
      // @ts-ignore - glassEffect contains web-only props
      style={[
        cardStyles.goldFeatured,
        { marginHorizontal: spacing[7], marginBottom: spacing[10] },
        glassEffect,
      ]}
    >
      <View
        style={decorativeOrb(palette.gold[500], 160, {
          top: -40,
          right: -40,
        })}
      />
      <View style={layout.row}>
        <View
          style={[
            iconContainer.featured,
            {
              backgroundColor: palette.gold[150],
              borderWidth: 1,
              borderColor: palette.gold[300],
              marginRight: spacing[9],
            },
          ]}
        >
          <Text style={{ fontSize: 40 }}>🏆</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 10,
              color: palette.gold[700],
              textTransform: "uppercase",
              letterSpacing: 2,
              fontWeight: "700",
            }}
          >
            {t("your_ranking")}
          </Text>
          <Text style={[textStyles.rankingValue, { marginTop: spacing[1] }]}>
            #{ranking.rank.toLocaleString()}
          </Text>
          <Text
            style={[
              textStyles.sublabel,
              { color: palette.gold[600], marginTop: spacing[1] },
            ]}
          >
            {t("top_percent", { percent: ranking.percentile })}
          </Text>
        </View>
      </View>
    </View>
  );
};

