import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  layout,
  spacing,
  cardStyles,
  listItem,
  glassEffect,
  palette,
  textStyles,
} from "../../design";
import { SectionHeader } from "./SectionHeader";

type Language = "vi" | "en";

type TranslateFunction = (key: string, params?: Record<string, unknown>) => string;

interface LanguageSectionProps {
  t: TranslateFunction;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageSection: React.FC<LanguageSectionProps> = ({
  t,
  language,
  setLanguage,
}) => {
  const LanguageOption = ({
    lang,
    flag,
    label,
  }: {
    lang: Language;
    flag: string;
    label: string;
  }) => {
    const isSelected = language === lang;
    return (
      <TouchableOpacity
        testID={`language-${lang}`}
        accessibilityLabel={`language-${lang}`}
        onPress={() => setLanguage(lang)}
        style={[
          listItem,
          {
            backgroundColor: isSelected ? palette.gold[100] : "transparent",
            borderBottomWidth: lang === "vi" ? 1 : 0,
            borderBottomColor: palette.white[4],
          },
        ]}
      >
        <Text style={{ fontSize: 32, marginRight: spacing[7] }}>{flag}</Text>
        <Text style={[textStyles.inputLabel, { flex: 1 }]}>{label}</Text>
        {isSelected && (
          <View
            testID={`language-${lang}-selected`}
            accessibilityLabel={`language-${lang}-selected`}
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: palette.gold[500],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 14, color: palette.dark.base }}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      testID="language-section"
      accessibilityLabel="language-section"
      style={[layout.container, { marginBottom: spacing[10] }]}
    >
      <SectionHeader icon="🌐" title={t("language")} />

      <View
        // @ts-ignore - glassEffect contains web-only props
        style={[cardStyles.list, glassEffect]}
      >
        <LanguageOption lang="vi" flag="🇻🇳" label={t("vietnamese")} />
        <LanguageOption lang="en" flag="🇬🇧" label={t("english")} />
      </View>
    </View>
  );
};

