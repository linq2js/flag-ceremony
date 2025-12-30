import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { showAlert } from "../../utils/alert";
import {
  layout,
  spacing,
  cardStyles,
  listItem,
  glassEffect,
  palette,
  textStyles,
  iconContainer,
} from "../../design";
import { SectionHeader } from "./SectionHeader";
import {
  LightningIcon,
  ShareIcon,
  StarIcon,
  ArrowRightIcon,
} from "../Icons";

interface QuickActionsSectionProps {
  t: (key: string, params?: Record<string, unknown>) => string;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  t,
}) => {
  const QuickActionItem = ({
    icon,
    title,
    subtitle,
    isLast = false,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    isLast?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        listItem,
        !isLast && { borderBottomWidth: 1, borderBottomColor: palette.white[4] },
      ]}
      activeOpacity={0.7}
      onPress={() => showAlert(t("coming_soon"), t("coming_soon_message"))}
    >
      <View
        style={[
          iconContainer.xlarge,
          {
            backgroundColor: palette.white[6],
            borderWidth: 1,
            borderColor: palette.white[8],
            marginRight: spacing[7],
          },
        ]}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={textStyles.inputLabel}>{title}</Text>
        <Text style={[textStyles.inputHint, { marginTop: spacing[1] }]}>
          {subtitle}
        </Text>
      </View>
      <ArrowRightIcon size={20} color={palette.white[25]} />
    </TouchableOpacity>
  );

  return (
    <View style={layout.container}>
      <SectionHeader
        icon={<LightningIcon size={20} color={palette.gold[500]} />}
        title={t("quick_actions")}
      />

      <View
        // @ts-ignore - glassEffect contains web-only props
        style={[cardStyles.list, glassEffect]}
      >
        <QuickActionItem
          icon={<ShareIcon size={24} color={palette.white[70]} />}
          title={t("share_app")}
          subtitle={t("invite_friends")}
        />
        <QuickActionItem
          icon={<StarIcon size={24} color={palette.gold[500]} />}
          title={t("rate_app")}
          subtitle={t("leave_review")}
          isLast
        />
      </View>
    </View>
  );
};

