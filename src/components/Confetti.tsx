import React, { useEffect, useMemo } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const COLORS = [
  "#fbbf24", // Gold
  "#dc2626", // Red
  "#4ade80", // Green
  "#f97316", // Orange
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
  "#ffffff", // White
];

interface ParticleProps {
  index: number;
  totalParticles: number;
}

const Particle: React.FC<ParticleProps> = ({ index }) => {
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Randomize properties based on index
  const config = useMemo(() => {
    const seed = index * 1234.5678;
    const random = (min: number, max: number) => {
      const x = Math.sin(seed + index) * 10000;
      return min + (x - Math.floor(x)) * (max - min);
    };

    return {
      startX: random(0, SCREEN_WIDTH),
      startY: random(-50, -200),
      endX: random(-100, SCREEN_WIDTH + 100),
      endY: SCREEN_HEIGHT + 100,
      size: random(6, 14),
      color: COLORS[Math.floor(random(0, COLORS.length))],
      duration: random(2500, 4000),
      delay: random(0, 1500),
      rotationSpeed: random(2, 5),
      wobbleAmount: random(30, 80),
      shape: Math.floor(random(0, 3)), // 0: circle, 1: square, 2: star
    };
  }, [index]);

  useEffect(() => {
    progress.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(1, { duration: config.duration, easing: Easing.linear }),
        -1,
        false
      )
    );

    rotation.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(360 * config.rotationSpeed, {
          duration: config.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const wobble = Math.sin(progress.value * Math.PI * 4) * config.wobbleAmount;

    return {
      position: "absolute",
      left:
        interpolate(progress.value, [0, 1], [config.startX, config.endX]) +
        wobble,
      top: interpolate(progress.value, [0, 1], [config.startY, config.endY]),
      width: config.size,
      height:
        config.shape === 2
          ? config.size
          : config.size * (config.shape === 1 ? 1 : 0.6),
      backgroundColor: config.shape === 2 ? "transparent" : config.color,
      borderRadius:
        config.shape === 0 ? config.size / 2 : config.shape === 1 ? 2 : 0,
      transform: [{ rotate: `${rotation.value}deg` }],
      opacity: interpolate(progress.value, [0, 0.1, 0.8, 1], [0, 1, 1, 0]),
    };
  });

  // Star shape using borders
  if (config.shape === 2) {
    return (
      <Animated.View style={animatedStyle}>
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: config.size / 2,
            borderRightWidth: config.size / 2,
            borderBottomWidth: config.size,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: config.color,
          }}
        />
      </Animated.View>
    );
  }

  return <Animated.View style={animatedStyle} />;
};

// Firework burst particle
interface BurstParticleProps {
  burstIndex: number;
  particleIndex: number;
  centerX: number;
  centerY: number;
}

const BurstParticle: React.FC<BurstParticleProps> = ({
  burstIndex,
  particleIndex,
  centerX,
  centerY,
}) => {
  const progress = useSharedValue(0);

  const config = useMemo(() => {
    const angle = (particleIndex / 12) * Math.PI * 2;
    const distance = 80 + Math.random() * 60;
    const delay = burstIndex * 800 + Math.random() * 200;

    return {
      angle,
      distance,
      delay,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 4 + Math.random() * 4,
    };
  }, [burstIndex, particleIndex]);

  useEffect(() => {
    progress.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const x =
      centerX + Math.cos(config.angle) * config.distance * progress.value;
    const y =
      centerY + Math.sin(config.angle) * config.distance * progress.value;

    return {
      position: "absolute",
      left: x - config.size / 2,
      top: y - config.size / 2,
      width: config.size,
      height: config.size,
      borderRadius: config.size / 2,
      backgroundColor: config.color,
      opacity: interpolate(progress.value, [0, 0.3, 1], [1, 1, 0]),
      transform: [
        { scale: interpolate(progress.value, [0, 0.5, 1], [0.5, 1.2, 0.3]) },
      ],
    };
  });

  return <Animated.View style={animatedStyle} />;
};

interface ConfettiProps {
  active: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  if (!active) return null;

  // Falling confetti particles
  const particles = Array.from({ length: 30 }, (_, i) => (
    <Particle key={`particle-${i}`} index={i} totalParticles={30} />
  ));

  // Firework bursts at different positions
  const burstPositions = [
    { x: SCREEN_WIDTH * 0.2, y: SCREEN_HEIGHT * 0.3 },
    { x: SCREEN_WIDTH * 0.8, y: SCREEN_HEIGHT * 0.25 },
    { x: SCREEN_WIDTH * 0.5, y: SCREEN_HEIGHT * 0.2 },
    { x: SCREEN_WIDTH * 0.3, y: SCREEN_HEIGHT * 0.4 },
    { x: SCREEN_WIDTH * 0.7, y: SCREEN_HEIGHT * 0.35 },
  ];

  const bursts = burstPositions.flatMap((pos, burstIndex) =>
    Array.from({ length: 12 }, (_, particleIndex) => (
      <BurstParticle
        key={`burst-${burstIndex}-${particleIndex}`}
        burstIndex={burstIndex}
        particleIndex={particleIndex}
        centerX={pos.x}
        centerY={pos.y}
      />
    ))
  );

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
      {particles}
      {bursts}
    </View>
  );
};
