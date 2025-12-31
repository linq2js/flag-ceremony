/**
 * BadgeTypeSelector - Grid selector showing badge previews
 * Uses CSS transform with flexbox centering for both web and native
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { BadgeType, BadgeStats } from "../../stores/badge";
import { BADGE_TYPES } from "./badges-svg";
import { palette, spacing, textStyles } from "../../design";
import { BadgePreviewSVG } from "./BadgePreviewSVG";

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

// Breakpoint for switching between mobile (flexible) and tablet/desktop (fixed)
const WIDE_SCREEN_BREAKPOINT = 600;
// Fixed item width for wide screens
const FIXED_ITEM_WIDTH = 140;

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

  const isWideScreen = screenWidth >= WIDE_SCREEN_BREAKPOINT;
  const gap = spacing[3];
  const horizontalPadding = spacing[6] * 2;
  const availableWidth = screenWidth - horizontalPadding;

  // Mobile: 2 columns with flexible width (~50% each)
  // Wide screen: fixed width items, as many as fit per row
  const itemWidth = isWideScreen
    ? FIXED_ITEM_WIDTH
    : (availableWidth - gap) / 2;

  return (
    <View style={styles.container}>
      <Text style={[textStyles.inputLabel, { marginBottom: spacing[4] }]}>
        {t("badge_type")}
      </Text>
      <View style={[styles.grid, { gap }, isWideScreen && styles.gridWide]}>
        {badges.map(([type, info]) => {
          const isSelected = type === selected;
          // Calculate scaled dimensions for the container
          const scaledWidth = info.width * SCALE_FACTOR;
          const scaledHeight = info.height * SCALE_FACTOR;

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
              {/* Outer container: scaled size + overflow hidden + flexbox center */}
              <View
                style={[
                  styles.previewContainer,
                  {
                    width: scaledWidth,
                    height: scaledHeight,
                  },
                ]}
              >
                {/* Inner: full size, centered, then scaled */}
                <View
                  style={{
                    width: info.width,
                    height: info.height,
                    transform: [{ scale: SCALE_FACTOR }],
                    // transformOrigin defaults to 'center center'
                  }}
                >
                  <BadgePreviewSVG
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
                {type
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
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
  gridWide: {
    justifyContent: "center",
  },
  gridItem: {
    alignItems: "center",
    padding: spacing[2],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    marginBottom: spacing[3],
  },
  gridItemSelected: {
    borderColor: palette.gold[500],
    backgroundColor: palette.dark.base,
  },
  previewContainer: {
    overflow: "hidden",
    borderRadius: 6,
    marginBottom: spacing[2],
    // Flexbox centering - inner element scales from center
    alignItems: "center",
    justifyContent: "center",
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
