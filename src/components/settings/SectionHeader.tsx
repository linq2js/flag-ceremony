import React from "react";
import { View, Text } from "react-native";
import { textStyles, spacing, layout } from "../../design";

interface SectionHeaderProps {
  icon: string;
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title }) => (
  <View style={[layout.row, { marginBottom: spacing[7] }]}>
    <Text style={{ fontSize: 22, marginRight: spacing[4] }}>{icon}</Text>
    <Text style={textStyles.sectionTitle}>{title}</Text>
  </View>
);

