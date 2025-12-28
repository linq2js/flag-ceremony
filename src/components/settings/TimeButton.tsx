import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { palette, spacing, radius } from "../../design";

interface TimeButtonProps {
  value: number;
  selected: boolean;
  onPress: () => void;
}

export const TimeButton: React.FC<TimeButtonProps> = ({
  value,
  selected,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[4],
      marginRight: spacing[3],
      borderRadius: radius.md,
      backgroundColor: selected ? palette.gold[500] : palette.white[6],
      borderWidth: 1,
      borderColor: selected ? palette.gold[400] : palette.white[4],
    }}
  >
    <Text
      style={{
        fontSize: 16,
        fontWeight: "700",
        color: selected ? palette.dark.base : palette.white[50],
      }}
    >
      {String(value).padStart(2, "0")}
    </Text>
  </TouchableOpacity>
);

