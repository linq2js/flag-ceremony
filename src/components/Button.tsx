import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  icon,
  loading = false,
  disabled = false,
}) => {
  const sizeStyles = {
    small: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      fontSize: 14,
      iconSize: 16,
    },
    medium: {
      paddingVertical: 14,
      paddingHorizontal: 28,
      fontSize: 16,
      iconSize: 18,
    },
    large: {
      paddingVertical: 18,
      paddingHorizontal: 36,
      fontSize: 17,
      iconSize: 20,
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: "rgba(185, 28, 28, 0.9)",
      borderColor: "rgba(239, 68, 68, 0.5)",
      textColor: "#ffffff",
      glowColor: "#dc2626",
    },
    secondary: {
      backgroundColor: "rgba(255,255,255,0.08)",
      borderColor: "rgba(255,255,255,0.15)",
      textColor: "#ffffff",
      glowColor: "transparent",
    },
    ghost: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      textColor: "rgba(255,255,255,0.7)",
      glowColor: "transparent",
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  const glassStyle = Platform.select({
    web: {
      backdropFilter: variant !== "ghost" ? "blur(12px)" : undefined,
      WebkitBackdropFilter: variant !== "ghost" ? "blur(12px)" : undefined,
    },
    default: {},
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        {
          backgroundColor: currentVariant.backgroundColor,
          borderWidth: variant === "ghost" ? 0 : 1,
          borderColor: currentVariant.borderColor,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          borderRadius: 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
          overflow: "hidden",
          // Shadow for primary variant
          ...(variant === "primary" && {
            shadowColor: currentVariant.glowColor,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
          }),
        },
        // @ts-ignore
        glassStyle,
      ]}
    >
      {/* Inner glow effect for primary */}
      {variant === "primary" && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            backgroundColor: "rgba(255,255,255,0.1)",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
          }}
        />
      )}

      {loading ? (
        <ActivityIndicator color={currentVariant.textColor} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {icon && <View style={{ marginRight: 10 }}>{icon}</View>}
          <Text
            style={{
              color: currentVariant.textColor,
              fontSize: currentSize.fontSize,
              fontWeight: "700",
              letterSpacing: 0.3,
            }}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
