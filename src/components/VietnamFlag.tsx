import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useEffect } from "react";
import Svg, { Polygon, Rect } from "react-native-svg";

interface VietnamFlagProps {
  width?: number;
  height?: number;
  animated?: boolean;
  opacity?: number;
  showPole?: boolean;
}

// Calculate 5-pointed star points
const getStarPoints = (cx: number, cy: number, outerR: number, innerR: number): string => {
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    // Outer point (tip of star)
    const outerAngle = (Math.PI / 2) + (i * 2 * Math.PI / 5);
    const outerX = cx + outerR * Math.cos(outerAngle);
    const outerY = cy - outerR * Math.sin(outerAngle);
    points.push(`${outerX},${outerY}`);
    
    // Inner point (valley of star)
    const innerAngle = outerAngle + Math.PI / 5;
    const innerX = cx + innerR * Math.cos(innerAngle);
    const innerY = cy - innerR * Math.sin(innerAngle);
    points.push(`${innerX},${innerY}`);
  }
  return points.join(" ");
};

// SVG-based Vietnam Flag
const VietnamFlagSvg: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const cx = width / 2;
  const cy = height / 2;
  const outerR = height * 0.35; // Star outer radius
  const innerR = outerR * 0.382; // Golden ratio for proper 5-pointed star
  
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Red background */}
      <Rect x="0" y="0" width={width} height={height} fill="#DA251D" />
      {/* Yellow star */}
      <Polygon
        points={getStarPoints(cx, cy, outerR, innerR)}
        fill="#FFFF00"
      />
    </Svg>
  );
};

export const VietnamFlag: React.FC<VietnamFlagProps> = ({
  width = 120,
  height = 80,
  animated = false,
  opacity = 1,
  showPole = false,
}) => {
  const waveProgress = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      waveProgress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000 }),
          withTiming(0, { duration: 2000 })
        ),
        -1,
        false
      );
    }
  }, [animated]);

  const flagAnimatedStyle = useAnimatedStyle(() => {
    if (!animated) return {};
    const skewX = interpolate(waveProgress.value, [0, 1], [-1, 1]);
    const scaleX = interpolate(waveProgress.value, [0, 0.5, 1], [1, 0.98, 1]);
    return {
      transform: [{ skewX: `${skewX}deg` }, { scaleX }],
    };
  });

  const poleHeight = height * 2;

  return (
    <View style={{ opacity, flexDirection: "row" }}>
      {showPole && (
        <View style={{ alignItems: "center", marginRight: -2 }}>
          {/* Pole top ornament */}
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: "#fcd34d",
              shadowColor: "#000",
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
            }}
          />
          {/* Pole */}
          <View
            style={{
              width: 5,
              height: poleHeight,
              backgroundColor: "#b45309",
              borderRadius: 2,
              shadowColor: "#000",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}
          />
        </View>
      )}

      {/* Flag */}
      <Animated.View
        style={[
          {
            width,
            height,
            borderRadius: 2,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            marginTop: showPole ? 10 : 0,
          },
          flagAnimatedStyle,
        ]}
      >
        <VietnamFlagSvg width={width} height={height} />
      </Animated.View>
    </View>
  );
};

// Small icon version for tab bar, buttons, etc.
export const VietnamFlagIcon: React.FC<{ size?: number }> = ({ size = 24 }) => {
  const width = size;
  const height = size * 0.67;
  
  return (
    <View style={{ borderRadius: 2, overflow: "hidden" }}>
      <VietnamFlagSvg width={width} height={height} />
    </View>
  );
};

// Background overlay version
export const VietnamFlagOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.12 }) => {
  return (
    <View
      style={{
        position: "absolute",
        top: 30,
        right: 10,
        opacity,
        zIndex: 0,
      }}
    >
      <VietnamFlag width={140} height={93} showPole opacity={1} />
    </View>
  );
};
