import React from "react";
import { View, Text, Platform } from "react-native";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sublabel?: string;
  color?: "gold" | "crimson" | "white" | "green";
  testID?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  sublabel,
  color = "gold",
  testID,
}) => {
  const colors = {
    gold: { accent: "#fbbf24", bg: "rgba(251, 191, 36, 0.08)" },
    crimson: { accent: "#f87171", bg: "rgba(248, 113, 113, 0.08)" },
    white: { accent: "#ffffff", bg: "rgba(255, 255, 255, 0.05)" },
    green: { accent: "#4ade80", bg: "rgba(74, 222, 128, 0.08)" },
  };

  const currentColor = colors[color];

  const glassStyle = Platform.select({
    web: {
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    },
    default: {},
  });

  return (
    <View
      testID={testID}
      accessibilityLabel={testID}
      style={[
        {
          flex: 1,
          backgroundColor: currentColor.bg,
          borderRadius: 20,
          padding: 16,
          borderWidth: 1,
          borderColor: `${currentColor.accent}20`,
          overflow: "hidden",
        },
        // @ts-ignore
        glassStyle,
      ]}
    >
      {/* Glow effect */}
      <View
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: currentColor.accent,
          opacity: 0.08,
        }}
      />

      <View style={{ marginBottom: 10 }}>
        {typeof icon === "string" ? (
          <Text style={{ fontSize: 28 }}>{icon}</Text>
        ) : (
          icon
        )}
      </View>
      <Text
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          letterSpacing: 1.2,
          fontWeight: "700",
          marginBottom: 6,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 36,
          fontWeight: "800",
          color: currentColor.accent,
          marginBottom: 2,
          letterSpacing: -1,
        }}
        numberOfLines={1}
      >
        {value}
      </Text>
      {sublabel && (
        <Text
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            fontWeight: "500",
          }}
          numberOfLines={1}
        >
          {sublabel}
        </Text>
      )}
    </View>
  );
};
