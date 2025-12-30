import React from "react";
import { View, Text } from "react-native";
import {
  layout,
  spacing,
  cardStyles,
  glassEffect,
  palette,
  colors,
  textStyles,
  decorativeOrb,
} from "../../design";
import { SectionHeader } from "./SectionHeader";
import { InfoIcon } from "../Icons";

interface AboutSectionProps {
  t: (key: string, params?: Record<string, unknown>) => string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ t }) => {
  return (
    <View style={[layout.container, { marginBottom: spacing[10] }]}>
      <SectionHeader
        icon={<InfoIcon size={20} color={palette.gold[500]} />}
        title={t("about")}
      />

      <View
        // @ts-ignore - glassEffect contains web-only props
        style={[
          cardStyles.default,
          { padding: spacing[11], alignItems: "center" },
          glassEffect,
        ]}
      >
        <View
          style={decorativeOrb(palette.crimson[500], 120, {
            top: -40,
            right: -40,
          })}
        />
        <Text style={{ fontSize: 72, marginBottom: spacing[9] }}>🇻🇳</Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: colors.text.primary,
          }}
        >
          {t("app_name")}
        </Text>
        <Text style={[textStyles.sublabel, { marginTop: spacing[2] }]}>
          {t("version")} 1.0.0
        </Text>
        <Text
          style={[
            textStyles.body,
            { textAlign: "center", marginTop: spacing[9] },
          ]}
        >
          {t("about_desc")}
        </Text>
      </View>
    </View>
  );
};

