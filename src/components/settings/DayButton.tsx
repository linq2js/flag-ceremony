import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { textStyles, spacing, palette, calendarDay } from "../../design";

interface DayButtonProps {
  dayName: string;
  selected: boolean;
  onPress: () => void;
}

export const DayButton: React.FC<DayButtonProps> = ({
  dayName,
  selected,
  onPress,
}) => (
  <View style={{ alignItems: "center" }}>
    <Text style={[textStyles.statLabel, { marginBottom: spacing[4] }]}>
      {dayName}
    </Text>
    <TouchableOpacity
      onPress={onPress}
      style={[
        calendarDay.cell,
        selected
          ? {
              backgroundColor: palette.gold[500],
              borderColor: palette.gold[400],
            }
          : calendarDay.default,
      ]}
    >
      {selected && (
        <Text style={{ fontSize: 18, color: palette.dark.base }}>✓</Text>
      )}
    </TouchableOpacity>
  </View>
);

