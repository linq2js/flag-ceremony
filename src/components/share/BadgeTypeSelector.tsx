/**
 * BadgeTypeSelector - Grid selector showing badge previews
 * Uses transform scale for accurate preview rendering
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { BadgeType, BadgeStats, BADGE_TYPES } from "../../stores/badge";
import { palette, spacing, textStyles } from "../../design";
import { BadgePreview } from "./BadgePreview";

interface BadgeTypeSelectorProps {
  selected: BadgeType;
  onSelect: (type: BadgeType) => void;
  photoUri: string | null;
  displayName: string;
  stats: BadgeStats | null;
  t: (key: string) => string;
}

// Base badge size used in badge components (renders at 300x300)
const BADGE_BASE_SIZE = 300;
// Target thumbnail size for display
const THUMBNAIL_SIZE = 100;
// Transform scale factor
const SCALE_FACTOR = THUMBNAIL_SIZE / BADGE_BASE_SIZE;

export const BadgeTypeSelector: React.FC<BadgeTypeSelectorProps> = ({
  selected,
  onSelect,
  photoUri,
  displayName,
  stats,
  t,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const badges = Object.entries(BADGE_TYPES) as [
    BadgeType,
    (typeof BADGE_TYPES)[BadgeType]
  ][];

  // Calculate grid layout - 3 columns with gaps
  const horizontalPadding = spacing[6] * 2;
  const gap = spacing[3];
  const availableWidth = screenWidth - horizontalPadding;
  const columns = 3;
  const itemWidth = (availableWidth - gap * (columns - 1)) / columns;

  return (
    <View style={styles.container}>
      <Text style={[textStyles.inputLabel, { marginBottom: spacing[4] }]}>
        {t("badge_type")}
      </Text>
      <View style={[styles.grid, { gap }]}>
        {badges.map(([type, info]) => {
          const isSelected = type === selected;
          // Calculate scaled dimensions for the container
          const scaledWidth = BADGE_BASE_SIZE * SCALE_FACTOR;
          const scaledHeight =
            BADGE_BASE_SIZE * (info.height / info.width) * SCALE_FACTOR;

          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.gridItem,
                { width: itemWidth },
                isSelected && styles.gridItemSelected,
              ]}
              onPress={() => onSelect(type)}
              activeOpacity={0.7}
            >
              {/* Container with the final display size */}
              <View
                style={[
                  styles.previewContainer,
                  {
                    width: scaledWidth,
                    height: scaledHeight,
                  },
                ]}
              >
                {/* Inner container that renders full size then scales down */}
                <View
                  style={{
                    width: BADGE_BASE_SIZE,
                    height: BADGE_BASE_SIZE * (info.height / info.width),
                    transform: [{ scale: SCALE_FACTOR }],
                  }}
                >
                  <BadgePreview
                    badgeType={type}
                    photoUri={photoUri}
                    displayName={displayName}
                    stats={stats}
                    t={t}
                    previewScale={1}
                  />
                </View>
              </View>
              <Text
                style={[
                  styles.badgeName,
                  isSelected && styles.badgeNameSelected,
                ]}
                numberOfLines={1}
              >
                {info.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    alignItems: "center",
    padding: spacing[2],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: palette.dark[700],
    marginBottom: spacing[3],
  },
  gridItemSelected: {
    borderColor: palette.gold[500],
    backgroundColor: palette.dark[600],
  },
  previewContainer: {
    overflow: "hidden",
    borderRadius: 6,
    marginBottom: spacing[2],
  },
  badgeName: {
    ...textStyles.bodySmall,
    color: palette.white[60],
    fontWeight: "600",
    textAlign: "center",
    fontSize: 11,
  },
  badgeNameSelected: {
    color: palette.gold[500],
  },
});
