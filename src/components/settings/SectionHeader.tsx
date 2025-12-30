import React from "react";
import { View, Text } from "react-native";
import { textStyles, spacing, layout } from "../../design";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title }) => (
  <View style={[layout.row, { marginBottom: spacing[7] }]}>
    <View style={{ marginRight: spacing[4] }}>
      {typeof icon === "string" ? (
        <Text style={{ fontSize: 22 }}>{icon}</Text>
      ) : (
        icon
      )}
    </View>
    <Text style={textStyles.sectionTitle}>{title}</Text>
  </View>
);

