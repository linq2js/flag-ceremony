import React, { useEffect } from "react";
import { View, Text, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";

interface CountdownViewProps {
  number: number;
  label: string;
}

export const CountdownView: React.FC<CountdownViewProps> = ({
  number,
  label,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Reset and animate on number change
    scale.value = 0;
    opacity.value = 1;

    scale.value = withSequence(
      withTiming(1.2, { duration: 200, easing: Easing.out(Easing.back()) }),
      withTiming(1, { duration: 100 })
    );

    opacity.value = withDelay(600, withTiming(0, { duration: 300 }));
  }, [number, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View testID="countdown-view" accessibilityLabel="countdown-view" style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={animatedStyle}>
        <Text
          style={{
            fontSize: 160,
            fontWeight: "900",
            color: "#fbbf24",
            ...Platform.select({
              web: { textShadow: "0 0 40px rgba(251, 191, 36, 0.5)" },
              default: {
                textShadowColor: "rgba(251, 191, 36, 0.5)",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 40,
              },
            }),
          }}
        >
          {number}
        </Text>
      </Animated.View>
      <Text
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          marginTop: 20,
          textTransform: "uppercase",
          letterSpacing: 4,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

