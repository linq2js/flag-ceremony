import React from "react";
import { View, StyleSheet, Platform, ViewStyle, StyleProp } from "react-native";
import { BlurView } from "expo-blur";

// Web-only glass effect styles (not in ViewStyle types)
const webGlassStyle = {
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
} as StyleProp<ViewStyle>;

interface GlassCardProps {
  children: React.ReactNode;
  intensity?: number;
  tint?: "light" | "dark" | "default";
  style?: ViewStyle;
  borderRadius?: number;
  padding?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  intensity = 40,
  tint = "dark",
  style,
  borderRadius = 24,
  padding = 20,
}) => {
  // For web, we use CSS backdrop-filter
  if (Platform.OS === "web") {
    return (
      <View
        style={[
          {
            borderRadius,
            padding,
            overflow: "hidden",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
          },
          webGlassStyle,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  // For native, we use BlurView
  return (
    <View style={[{ borderRadius, overflow: "hidden" }, style]}>
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        ]}
      />
      <View
        style={{
          padding,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderRadius,
        }}
      >
        {children}
      </View>
    </View>
  );
};

// Accent glass variants
export const GlassCardGold: React.FC<GlassCardProps> = (props) => {
  if (Platform.OS === "web") {
    return (
      <View
        style={[
          {
            borderRadius: props.borderRadius || 24,
            padding: props.padding || 20,
            overflow: "hidden",
            backgroundColor: "rgba(251, 191, 36, 0.08)",
            borderWidth: 1,
            borderColor: "rgba(251, 191, 36, 0.2)",
          },
          webGlassStyle,
          props.style,
        ]}
      >
        {props.children}
      </View>
    );
  }

  return (
    <View
      style={[
        { borderRadius: props.borderRadius || 24, overflow: "hidden" },
        props.style,
      ]}
    >
      <BlurView
        intensity={props.intensity || 40}
        tint="dark"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(251, 191, 36, 0.08)" },
        ]}
      />
      <View
        style={{
          padding: props.padding || 20,
          borderWidth: 1,
          borderColor: "rgba(251, 191, 36, 0.2)",
          borderRadius: props.borderRadius || 24,
        }}
      >
        {props.children}
      </View>
    </View>
  );
};

export const GlassCardGreen: React.FC<GlassCardProps> = (props) => {
  if (Platform.OS === "web") {
    return (
      <View
        style={[
          {
            borderRadius: props.borderRadius || 24,
            padding: props.padding || 20,
            overflow: "hidden",
            backgroundColor: "rgba(34, 197, 94, 0.08)",
            borderWidth: 1,
            borderColor: "rgba(34, 197, 94, 0.2)",
          },
          webGlassStyle,
          props.style,
        ]}
      >
        {props.children}
      </View>
    );
  }

  return (
    <View
      style={[
        { borderRadius: props.borderRadius || 24, overflow: "hidden" },
        props.style,
      ]}
    >
      <BlurView
        intensity={props.intensity || 40}
        tint="dark"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(34, 197, 94, 0.08)" },
        ]}
      />
      <View
        style={{
          padding: props.padding || 20,
          borderWidth: 1,
          borderColor: "rgba(34, 197, 94, 0.2)",
          borderRadius: props.borderRadius || 24,
        }}
      >
        {props.children}
      </View>
    </View>
  );
};

export const GlassCardRed: React.FC<GlassCardProps> = (props) => {
  if (Platform.OS === "web") {
    return (
      <View
        style={[
          {
            borderRadius: props.borderRadius || 24,
            padding: props.padding || 20,
            overflow: "hidden",
            backgroundColor: "rgba(220, 38, 38, 0.08)",
            borderWidth: 1,
            borderColor: "rgba(220, 38, 38, 0.2)",
          },
          webGlassStyle,
          props.style,
        ]}
      >
        {props.children}
      </View>
    );
  }

  return (
    <View
      style={[
        { borderRadius: props.borderRadius || 24, overflow: "hidden" },
        props.style,
      ]}
    >
      <BlurView
        intensity={props.intensity || 40}
        tint="dark"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(220, 38, 38, 0.08)" },
        ]}
      />
      <View
        style={{
          padding: props.padding || 20,
          borderWidth: 1,
          borderColor: "rgba(220, 38, 38, 0.2)",
          borderRadius: props.borderRadius || 24,
        }}
      >
        {props.children}
      </View>
    </View>
  );
};
