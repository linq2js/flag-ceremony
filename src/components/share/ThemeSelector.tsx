/**
 * ThemeSelector - Color theme selector for badges
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeTheme, BADGE_THEMES } from "../../stores/badge";
import { palette, spacing, textStyles } from "../../design";

interface ThemeSelectorProps {
  selected: BadgeTheme;
  onSelect: (theme: BadgeTheme) => void;
  t: (key: string) => string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selected,
  onSelect,
  t,
}) => {
  const themes = Object.entries(BADGE_THEMES) as [BadgeTheme, typeof BADGE_THEMES[BadgeTheme]][];

  return (
    <View style={styles.container}>
      <Text style={[textStyles.inputLabel, { marginBottom: spacing[4] }]}>
        {t("badge_theme")}
      </Text>
      <View style={styles.themesRow}>
        {themes.map(([key, theme]) => {
          const isSelected = key === selected;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.themeButton, isSelected && styles.themeButtonSelected]}
              onPress={() => onSelect(key)}
            >
              <LinearGradient
                colors={theme.backgroundGradient as [string, string, ...string[]]}
                style={styles.themePreview}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View
                  style={[styles.accentDot, { backgroundColor: theme.accent }]}
                />
              </LinearGradient>
              <Text
                style={[
                  styles.themeName,
                  isSelected && styles.themeNameSelected,
                ]}
              >
                {t(`theme_${key}`)}
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
  themesRow: {
    flexDirection: "row",
    gap: spacing[3],
  },
  themeButton: {
    flex: 1,
    alignItems: "center",
    padding: spacing[2],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  themeButtonSelected: {
    borderColor: palette.gold[500],
    backgroundColor: palette.gold[50],
  },
  themePreview: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[2],
  },
  accentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  themeName: {
    ...textStyles.bodySmall,
    color: palette.white[60],
    fontWeight: "600",
  },
  themeNameSelected: {
    color: palette.gold[500],
  },
});

