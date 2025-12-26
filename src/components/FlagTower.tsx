import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Easing,
  SharedValue,
} from "react-native-reanimated";
import Svg, { Path, Polygon, Defs, LinearGradient, Stop, Rect, Circle } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface FlagTowerProps {
  width?: number;
  height?: number;
  flagProgress: SharedValue<number>; // 0 = bottom, 1 = top
}

// Calculate 5-pointed star points
const getStarPoints = (cx: number, cy: number, outerR: number, innerR: number): string => {
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = (Math.PI / 2) + (i * 2 * Math.PI / 5);
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
  const waveProgress = useSharedValue(0);

  // Start waving animation
  useEffect(() => {
    waveProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  // Flag dimensions
  const flagWidth = width * 0.45;
  const flagHeight = flagWidth * 0.67;
  const poleHeight = height * 0.85;
  const poleX = width * 0.5;
  const flagTopY = height * 0.08;
  const flagBottomY = height * 0.75;

  // Animated flag position (rising from bottom to top)
  const flagContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      flagProgress.value,
      [0, 1],
      [flagBottomY - flagTopY, 0]
    );
    return {
      transform: [{ translateY }],
    };
  });

  // Animated waving flag path
  const animatedFlagProps = useAnimatedProps(() => {
    const wave = waveProgress.value;
    const waveAmount = 6 + wave * 10;
    const waveOffset = wave * 4;
    
    const w = flagWidth;
    const h = flagHeight;
    
    const d = `
      M 0,${waveOffset}
      Q ${w * 0.25},${-waveAmount + waveOffset} ${w * 0.5},${waveOffset}
      Q ${w * 0.75},${waveAmount + waveOffset} ${w},${waveOffset}
      L ${w},${h + waveOffset}
      Q ${w * 0.75},${h - waveAmount + waveOffset} ${w * 0.5},${h + waveOffset}
      Q ${w * 0.25},${h + waveAmount + waveOffset} 0,${h + waveOffset}
      Z
    `;
    
    return { d };
  });

  // Star position animation (follows wave)
  const starAnimatedStyle = useAnimatedStyle(() => {
    const offsetX = interpolate(waveProgress.value, [0, 1], [0, 6]);
    const skew = interpolate(waveProgress.value, [0, 0.5, 1], [0, 3, 0]);
    
    return {
      transform: [
        { translateX: offsetX },
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
            top: flagTopY,
            width: flagWidth + 15,
            height: flagHeight + 25,
            zIndex: 0,
          },
          flagContainerStyle,
        ]}
      >
        {/* Flag SVG with wave animation */}
        <Svg
          width={flagWidth + 15}
          height={flagHeight + 25}
          viewBox={`0 -12 ${flagWidth} ${flagHeight + 24}`}
        >
          <Defs>
            <LinearGradient id="flagShade" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#000" stopOpacity={0.1} />
              <Stop offset="0.3" stopColor="#fff" stopOpacity={0.05} />
              <Stop offset="0.6" stopColor="#000" stopOpacity={0.08} />
              <Stop offset="1" stopColor="#000" stopOpacity={0.15} />
            </LinearGradient>
          </Defs>
          
          {/* Red wavy flag background */}
          <AnimatedPath
            animatedProps={animatedFlagProps}
            fill="#DA251D"
          />
          
          {/* Subtle shading for 3D effect */}
          <AnimatedPath
            animatedProps={animatedFlagProps}
            fill="url(#flagShade)"
          />
        </Svg>
        
        {/* Star - animated separately for better effect */}
        <Animated.View
          style={[
            {
              position: "absolute",
              left: flagWidth / 2 - starSize,
              top: flagHeight / 2 - starSize + 12,
              width: starSize * 2,
              height: starSize * 2,
            },
            starAnimatedStyle,
          ]}
        >
          <Svg
            width={starSize * 2}
            height={starSize * 2}
            viewBox={`${-starSize} ${-starSize} ${starSize * 2} ${starSize * 2}`}
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

