import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  useDerivedValue,
} from "react-native-reanimated";
import Svg, {
  Polygon,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
  G,
} from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface VietnamFlagProps {
  width?: number;
  height?: number;
  animated?: boolean;
  opacity?: number;
  showPole?: boolean;
}

// Calculate 5-pointed star points with optional offset
const getStarPoints = (
  cx: number,
  cy: number,
  outerR: number,
  innerR: number
): string => {
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const outerX = cx + outerR * Math.cos(outerAngle);
    const outerY = cy - outerR * Math.sin(outerAngle);
    points.push(`${outerX},${outerY}`);

    const innerAngle = outerAngle + Math.PI / 5;
    const innerX = cx + innerR * Math.cos(innerAngle);
    const innerY = cy - innerR * Math.sin(innerAngle);
    points.push(`${innerX},${innerY}`);
  }
  return points.join(" ");
};

// Static SVG flag for non-animated version
const VietnamFlagSvg: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const cx = width / 2;
  const cy = height / 2;
  const outerR = height * 0.35;
  const innerR = outerR * 0.382;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Rect x="0" y="0" width={width} height={height} fill="#DA251D" />
      <Polygon points={getStarPoints(cx, cy, outerR, innerR)} fill="#FFFF00" />
    </Svg>
  );
};

// Animated waving flag with realistic fabric simulation
const AnimatedWavingFlag: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  // Multiple wave phases for organic motion
  const wave1 = useSharedValue(0);
  const wave2 = useSharedValue(0);
  const wave3 = useSharedValue(0);

  useEffect(() => {
    // Primary gentle wave - slow and smooth
    wave1.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    // Secondary ripple - slightly faster
    wave2.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    // Tertiary micro-movement - subtle detail
    wave3.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  // Generate wave path for flag edge
  const flagPath = useDerivedValue(() => {
    const w1 = wave1.value;
    const w2 = wave2.value;
    const w3 = wave3.value;

    // Wave amplitudes - gentle breeze
    const amp1 = height * 0.03;
    const amp2 = height * 0.02;
    const amp3 = height * 0.01;

    // Calculate wave offsets at different points
    const getWaveY = (x: number, baseY: number) => {
      const phase = x / width;
      const y1 = Math.sin((w1 + phase) * Math.PI * 2) * amp1;
      const y2 = Math.sin((w2 + phase * 1.5) * Math.PI * 2) * amp2;
      const y3 = Math.sin((w3 + phase * 2) * Math.PI * 2) * amp3;
      return baseY + y1 + y2 + y3;
    };

    // Right edge wave effect (more movement on free edge)
    const rightWave = (baseY: number) => {
      const y1 = Math.sin(w1 * Math.PI * 2) * amp1 * 2;
      const y2 = Math.sin(w2 * Math.PI * 2 + 0.5) * amp2 * 2;
      return baseY + y1 + y2;
    };

    // Build flag shape with wavy edges
    const topY = getWaveY(width * 0.5, 0);
    const bottomY = getWaveY(width * 0.5, height);
    const rightTopY = rightWave(0);
    const rightBottomY = rightWave(height);

    // Control points for smooth bezier curves
    const cp1x = width * 0.33;
    const cp2x = width * 0.66;

    return `
      M 0,0
      C ${cp1x},${getWaveY(cp1x, -amp1)} ${cp2x},${getWaveY(
      cp2x,
      amp1
    )} ${width},${rightTopY}
      L ${width},${rightBottomY}
      C ${cp2x},${getWaveY(cp2x, height - amp1)} ${cp1x},${getWaveY(
      cp1x,
      height + amp1
    )} 0,${height}
      Z
    `;
  });

  // Animated shadow/highlight for depth
  const shadowOpacity = useDerivedValue(() => {
    return interpolate(wave1.value, [0, 0.5, 1], [0.1, 0.2, 0.1]);
  });

  const highlightOpacity = useDerivedValue(() => {
    return interpolate(wave2.value, [0, 0.5, 1], [0.05, 0.15, 0.05]);
  });

  // Subtle horizontal shift for fabric movement feel
  const fabricShift = useDerivedValue(() => {
    return interpolate(wave1.value, [0, 0.5, 1], [0, width * 0.01, 0]);
  });

  const animatedPathProps = useAnimatedProps(() => ({
    d: flagPath.value,
  }));

  const animatedShadowProps = useAnimatedProps(() => ({
    opacity: shadowOpacity.value,
  }));

  const animatedHighlightProps = useAnimatedProps(() => ({
    opacity: highlightOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: fabricShift.value }],
  }));

  const cx = width / 2;
  const cy = height / 2;
  const outerR = height * 0.35;
  const innerR = outerR * 0.382;

  return (
    <Animated.View style={containerStyle}>
      <Svg
        width={width}
        height={height + 10}
        viewBox={`0 -5 ${width} ${height + 10}`}
      >
        <Defs>
          {/* Clip path for the waving flag shape */}
          <ClipPath id="flagClip">
            <AnimatedPath animatedProps={animatedPathProps} />
          </ClipPath>

          {/* Gradient for fabric shadow (left to right, depth effect) */}
          <LinearGradient id="fabricShadow" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#000000" stopOpacity="0" />
            <Stop offset="0.3" stopColor="#000000" stopOpacity="0.1" />
            <Stop offset="0.6" stopColor="#000000" stopOpacity="0.05" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0.15" />
          </LinearGradient>

          {/* Gradient for wave highlights */}
          <LinearGradient id="waveHighlight" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <Stop offset="0.4" stopColor="#ffffff" stopOpacity="0.1" />
            <Stop offset="0.7" stopColor="#ffffff" stopOpacity="0.05" />
            <Stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </LinearGradient>

          {/* Vertical gradient for top/bottom shading */}
          <LinearGradient id="verticalShade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ffffff" stopOpacity="0.08" />
            <Stop offset="0.5" stopColor="#000000" stopOpacity="0" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0.1" />
          </LinearGradient>
        </Defs>

        {/* Flag content clipped to wavy shape */}
        <G clipPath="url(#flagClip)">
          {/* Red background */}
          <Rect x="0" y="0" width={width} height={height} fill="#DA251D" />

          {/* Yellow star */}
          <Polygon
            points={getStarPoints(cx, cy, outerR, innerR)}
            fill="#FFFF00"
          />

          {/* Fabric shadow overlay */}
          <AnimatedRect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="url(#fabricShadow)"
            animatedProps={animatedShadowProps}
          />

          {/* Wave highlight overlay */}
          <AnimatedRect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="url(#waveHighlight)"
            animatedProps={animatedHighlightProps}
          />

          {/* Vertical shading for depth */}
          <Rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="url(#verticalShade)"
          />
        </G>
      </Svg>
    </Animated.View>
  );
};

export const VietnamFlag: React.FC<VietnamFlagProps> = ({
  width = 120,
  height = 80,
  animated = false,
  opacity = 1,
  showPole = false,
}) => {
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
      <View
        style={{
          width,
          height: height + 10,
          marginTop: showPole ? 5 : -5,
          shadowColor: "#000",
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
        }}
      >
        {animated ? (
          <AnimatedWavingFlag width={width} height={height} />
        ) : (
          <VietnamFlagSvg width={width} height={height} />
        )}
      </View>
    </View>
  );
};

// Small icon version for tab bar, buttons, etc.
export const VietnamFlagIcon: React.FC<{
  /** Convenience sizing (maps to width). Prefer `height` for tab bar alignment. */
  size?: number;
  /** Explicit width in px (overrides `size` if provided). */
  width?: number;
  /** Explicit height in px (recommended). If set, width is derived to keep aspect. */
  height?: number;
}> = ({ size = 24, width: widthProp, height: heightProp }) => {
  // Keep the same aspect ratio as before (height = width * 0.67)
  const heightFromWidth = (w: number) => w * 0.67;
  const widthFromHeight = (h: number) => h / 0.67;

  const height =
    heightProp ??
    (widthProp ? heightFromWidth(widthProp) : heightFromWidth(size));
  const width = widthProp ?? (heightProp ? widthFromHeight(heightProp) : size);

  return (
    <View style={{ borderRadius: 2, overflow: "hidden" }}>
      <VietnamFlagSvg width={width} height={height} />
    </View>
  );
};

// Background overlay version
export const VietnamFlagOverlay: React.FC<{ opacity?: number }> = ({
  opacity = 0.12,
}) => {
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
