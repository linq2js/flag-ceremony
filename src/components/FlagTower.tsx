import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
  SharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import Svg, {
  Path,
  Polygon,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  ClipPath,
  G,
} from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface FlagTowerProps {
  width?: number;
  height?: number;
  flagProgress: SharedValue<number>; // 0 = bottom, 1 = top
}

// Calculate 5-pointed star points
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

export const FlagTower: React.FC<FlagTowerProps> = ({
  width = 300,
  height = 400,
  flagProgress,
}) => {
  // Multiple wave phases for organic motion
  const wave1 = useSharedValue(0);
  const wave2 = useSharedValue(0);
  const wave3 = useSharedValue(0);

  // Start waving animation
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

  // Flag dimensions
  const flagWidth = width * 0.45;
  const flagHeight = flagWidth * 0.67;
  const poleHeight = height * 0.85;
  const poleX = width * 0.5;
  const poleTopY = height * 0.05;
  const poleBottomY = poleTopY + poleHeight; // Where the pole meets the base
  const svgPadding = 15;

  // Flag top position when fully raised (near pole top)
  const flagTopYWhenRaised = height * 0.08;
  // Flag top position when at bottom (flag bottom aligns with pole base)
  const flagTopYWhenBottom = poleBottomY - flagHeight - svgPadding;

  // Animated flag position (rising from bottom to top)
  const flagContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      flagProgress.value,
      [0, 1],
      [flagTopYWhenBottom - flagTopYWhenRaised, 0]
    );
    return {
      transform: [{ translateY }],
    };
  });

  // Generate wave path for flag edge - realistic fabric simulation
  const flagPath = useDerivedValue(() => {
    const w1 = wave1.value;
    const w2 = wave2.value;
    const w3 = wave3.value;

    const w = flagWidth;
    const h = flagHeight;

    // Wave amplitudes - gentle breeze
    const amp1 = h * 0.04;
    const amp2 = h * 0.025;
    const amp3 = h * 0.015;

    // Calculate wave offsets at different points
    const getWaveY = (x: number, baseY: number) => {
      const phase = x / w;
      const y1 = Math.sin((w1 + phase) * Math.PI * 2) * amp1;
      const y2 = Math.sin((w2 + phase * 1.5) * Math.PI * 2) * amp2;
      const y3 = Math.sin((w3 + phase * 2) * Math.PI * 2) * amp3;
      return baseY + y1 + y2 + y3;
    };

    // Right edge wave effect (more movement on free edge)
    const rightWave = (baseY: number) => {
      const y1 = Math.sin(w1 * Math.PI * 2) * amp1 * 2.5;
      const y2 = Math.sin(w2 * Math.PI * 2 + 0.5) * amp2 * 2;
      return baseY + y1 + y2;
    };

    // Build flag shape with wavy edges
    const rightTopY = rightWave(0);
    const rightBottomY = rightWave(h);

    // Control points for smooth bezier curves
    const cp1x = w * 0.33;
    const cp2x = w * 0.66;

    return `
      M 0,0
      C ${cp1x},${getWaveY(cp1x, -amp1)} ${cp2x},${getWaveY(
      cp2x,
      amp1
    )} ${w},${rightTopY}
      L ${w},${rightBottomY}
      C ${cp2x},${getWaveY(cp2x, h - amp1)} ${cp1x},${getWaveY(
      cp1x,
      h + amp1
    )} 0,${h}
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
    return interpolate(wave1.value, [0, 0.5, 1], [0, flagWidth * 0.015, 0]);
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

  const fabricShiftStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: fabricShift.value }],
  }));

  // Star position animation (follows wave gently)
  const starAnimatedStyle = useAnimatedStyle(() => {
    const offsetX = interpolate(wave1.value, [0, 0.5, 1], [0, 4, 0]);
    const offsetY = interpolate(wave2.value, [0, 0.5, 1], [-1, 1, -1]);
    const skew = interpolate(wave1.value, [0, 0.5, 1], [-1, 1, -1]);

    return {
      transform: [
        { translateX: offsetX },
        { translateY: offsetY },
        { skewX: `${skew}deg` },
      ],
    };
  });

  const starSize = flagHeight * 0.35;
  const starInnerR = starSize * 0.382;

  return (
    <View style={{ width, height, alignItems: "center" }}>
      {/* Flag Pole */}
      <View
        style={{
          position: "absolute",
          left: poleX - 4,
          top: height * 0.05,
          width: 8,
          height: poleHeight,
          backgroundColor: "#8B7355",
          borderRadius: 4,
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
          zIndex: 1,
        }}
      />

      {/* Pole Top Ornament */}
      <View
        style={{
          position: "absolute",
          left: poleX - 10,
          top: height * 0.03,
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: "#DAA520",
          shadowColor: "#000",
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
          zIndex: 2,
        }}
      />

      {/* Animated Flag Container */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: poleX + 4,
            top: flagTopYWhenRaised,
            width: flagWidth + svgPadding,
            height: flagHeight + svgPadding * 2,
            zIndex: 0,
          },
          flagContainerStyle,
        ]}
      >
        {/* Flag SVG with realistic wave animation */}
        <Animated.View style={fabricShiftStyle}>
          <Svg
            width={flagWidth + svgPadding}
            height={flagHeight + svgPadding * 2}
            viewBox={`0 ${-svgPadding} ${flagWidth} ${
              flagHeight + svgPadding * 2
            }`}
          >
            <Defs>
              {/* Clip path for the waving flag shape */}
              <ClipPath id="towerFlagClip">
                <AnimatedPath animatedProps={animatedPathProps} />
              </ClipPath>

              {/* Gradient for fabric shadow (left to right, depth effect) */}
              <LinearGradient
                id="towerFabricShadow"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <Stop offset="0" stopColor="#000000" stopOpacity="0" />
                <Stop offset="0.3" stopColor="#000000" stopOpacity="0.1" />
                <Stop offset="0.6" stopColor="#000000" stopOpacity="0.05" />
                <Stop offset="1" stopColor="#000000" stopOpacity="0.18" />
              </LinearGradient>

              {/* Gradient for wave highlights */}
              <LinearGradient
                id="towerWaveHighlight"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <Stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                <Stop offset="0.35" stopColor="#ffffff" stopOpacity="0.12" />
                <Stop offset="0.65" stopColor="#ffffff" stopOpacity="0.05" />
                <Stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </LinearGradient>

              {/* Vertical gradient for top/bottom shading */}
              <LinearGradient
                id="towerVerticalShade"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <Stop offset="0" stopColor="#ffffff" stopOpacity="0.1" />
                <Stop offset="0.5" stopColor="#000000" stopOpacity="0" />
                <Stop offset="1" stopColor="#000000" stopOpacity="0.12" />
              </LinearGradient>
            </Defs>

            {/* Flag content clipped to wavy shape */}
            <G clipPath="url(#towerFlagClip)">
              {/* Red background */}
              <Rect
                x="0"
                y="0"
                width={flagWidth}
                height={flagHeight}
                fill="#DA251D"
              />

              {/* Fabric shadow overlay */}
              <AnimatedRect
                x="0"
                y="0"
                width={flagWidth}
                height={flagHeight}
                fill="url(#towerFabricShadow)"
                animatedProps={animatedShadowProps}
              />

              {/* Wave highlight overlay */}
              <AnimatedRect
                x="0"
                y="0"
                width={flagWidth}
                height={flagHeight}
                fill="url(#towerWaveHighlight)"
                animatedProps={animatedHighlightProps}
              />

              {/* Vertical shading for depth */}
              <Rect
                x="0"
                y="0"
                width={flagWidth}
                height={flagHeight}
                fill="url(#towerVerticalShade)"
              />
            </G>
          </Svg>
        </Animated.View>

        {/* Star - animated separately for better effect */}
        <Animated.View
          style={[
            {
              position: "absolute",
              left: flagWidth / 2 - starSize,
              top: flagHeight / 2 - starSize + svgPadding,
              width: starSize * 2,
              height: starSize * 2,
            },
            starAnimatedStyle,
          ]}
        >
          <Svg
            width={starSize * 2}
            height={starSize * 2}
            viewBox={`${-starSize} ${-starSize} ${starSize * 2} ${
              starSize * 2
            }`}
          >
            <Polygon
              points={getStarPoints(0, 0, starSize, starInnerR)}
              fill="#FFFF00"
            />
          </Svg>
        </Animated.View>
      </Animated.View>

      {/* Pole Base */}
      <View
        style={{
          position: "absolute",
          left: poleX - 15,
          bottom: height * 0.05,
          width: 30,
          height: 20,
          backgroundColor: "#5a4a3a",
          borderRadius: 4,
          zIndex: 1,
        }}
      />
    </View>
  );
};
