/**
 * NicknameSection - Settings section for viewing/changing nickname
 */
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  layout,
  spacing,
  cardStyles,
  glassEffect,
  palette,
  textStyles,
  radius,
} from "../../design";
import { SectionHeader } from "./SectionHeader";
import { UserIcon, EditIcon } from "../Icons";

type TranslateFunction = (
  key: string,
  params?: Record<string, unknown>
) => string;

interface NicknameSectionProps {
  t: TranslateFunction;
  nickname: string;
  onChangeNickname: () => void;
}

export const NicknameSection: React.FC<NicknameSectionProps> = ({
  t,
  nickname,
  onChangeNickname,
}) => {
  return (
    <View
      testID="nickname-section"
      accessibilityLabel="nickname-section"
      style={[layout.container, { marginBottom: spacing[10] }]}
    >
      <SectionHeader
        icon={<UserIcon size={20} color={palette.gold[500]} />}
        title={t("profile")}
      />

      <View
        // @ts-ignore - glassEffect contains web-only props
        style={[cardStyles.list, glassEffect]}
      >
        <View style={styles.nicknameRow}>
          <View style={styles.nicknameInfo}>
            <Text style={styles.label}>{t("nickname_label")}</Text>
            <Text style={styles.nickname} numberOfLines={1}>
              {nickname || t("nickname_not_set")}
            </Text>
          </View>

          <TouchableOpacity
            testID="change-nickname-button"
            accessibilityLabel="change-nickname-button"
            style={styles.changeButton}
            onPress={onChangeNickname}
          >
            <EditIcon size={16} color={palette.gold[500]} />
            <Text style={styles.changeButtonText}>{t("change")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nicknameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[6],
  },
  nicknameInfo: {
    flex: 1,
    marginRight: spacing[4],
  },
  label: {
    ...textStyles.bodySmall,
    color: palette.white[40],
    marginBottom: spacing[1],
  },
  nickname: {
    ...textStyles.inputLabel,
    color: palette.white.full,
  },
  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    backgroundColor: palette.gold[100],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.gold[200],
  },
  changeButtonText: {
    ...textStyles.body,
    color: palette.gold[500],
    fontWeight: "600",
    fontSize: 14,
  },
});

