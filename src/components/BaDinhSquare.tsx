import React from "react";
import { View } from "react-native";
import Svg, { Rect, Path, Ellipse, G, Circle } from "react-native-svg";

interface BaDinhSquareProps {
  width?: number;
  height?: number;
  opacity?: number;
}

export const BaDinhSquare: React.FC<BaDinhSquareProps> = ({
  width = 400,
  height = 300,
  opacity = 1,
}) => {
  // Monotone color scheme - dark maroon/crimson tones
  const bgColor = "#1a0808"; // Dark background
  const fgColor = "#3d1515"; // Foreground elements (lighter)
  const accentColor = "#5a2020"; // Accent/highlight
  const flagRed = "#8b2020"; // Flag red (slightly brighter for visibility)

  return (
    <View style={{ opacity }}>
      <Svg width={width} height={height} viewBox="0 0 400 300">
        {/* Background */}
        <Rect x="0" y="0" width="400" height="300" fill={bgColor} />

        {/* Ground / Square */}
        <Rect
          x="0"
          y="180"
          width="400"
          height="120"
          fill={fgColor}
          opacity={0.3}
        />

        {/* Square tiles pattern */}
        <G opacity={0.15}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Path
              key={`h${i}`}
              d={`M 0 ${185 + i * 13} L 400 ${185 + i * 13}`}
              stroke={accentColor}
              strokeWidth={0.5}
            />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Path
              key={`v${i}`}
              d={`M ${i * 40} 180 L ${i * 40} 300`}
              stroke={accentColor}
              strokeWidth={0.5}
            />
          ))}
        </G>

        {/* Mausoleum Base - Bottom tier */}
        <Path d="M 80,180 L 320,180 L 305,155 L 95,155 Z" fill={fgColor} />

        {/* Mausoleum Base - Middle tier */}
        <Path
          d="M 100,155 L 300,155 L 290,140 L 110,140 Z"
          fill={accentColor}
          opacity={0.8}
        />

        {/* Mausoleum Main Building */}
        <Rect x="115" y="75" width="170" height="65" fill={fgColor} />

        {/* Red panels between columns */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Rect
            key={`panel${i}`}
            x={130 + i * 24}
            y="82"
            width="14"
            height="52"
            fill={flagRed}
            opacity={0.6}
          />
        ))}

        {/* Columns */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Rect
            key={`col${i}`}
            x={122 + i * 20}
            y="78"
            width="6"
            height="60"
            fill={accentColor}
          />
        ))}

        {/* Mausoleum Roof */}
        <Path d="M 110,75 L 290,75 L 283,63 L 117,63 Z" fill={accentColor} />
        <Path d="M 117,63 L 283,63 L 278,55 L 122,55 Z" fill={fgColor} />

        {/* Top roof section */}
        <Rect
          x="140"
          y="45"
          width="120"
          height="10"
          fill={accentColor}
          opacity={0.9}
        />
        <Path d="M 145,45 L 255,45 L 250,38 L 150,38 Z" fill={fgColor} />

        {/* Text area - "CHỦ TỊCH" */}
        <Rect
          x="155"
          y="57"
          width="90"
          height="6"
          fill={bgColor}
          opacity={0.5}
        />

        {/* Text area - "HỒ CHÍ MINH" */}
        <Rect
          x="130"
          y="65"
          width="140"
          height="8"
          fill={bgColor}
          opacity={0.5}
        />

        {/* Entrance */}
        <Rect
          x="185"
          y="110"
          width="30"
          height="28"
          fill={flagRed}
          opacity={0.4}
        />

        {/* Stairs on left */}
        <Path
          d="M 80,180 L 95,155 L 95,180 Z"
          fill={accentColor}
          opacity={0.6}
        />

        {/* Trees/Bushes - Left side (silhouettes) */}
        <G>
          <Ellipse cx="25" cy="170" rx="30" ry="25" fill={fgColor} />
          <Ellipse
            cx="15"
            cy="178"
            rx="20"
            ry="18"
            fill={bgColor}
            opacity={0.5}
          />
          <Ellipse cx="45" cy="175" rx="25" ry="20" fill={fgColor} />

          <Ellipse cx="70" cy="165" rx="28" ry="22" fill={fgColor} />
          <Ellipse
            cx="60"
            cy="173"
            rx="18"
            ry="15"
            fill={bgColor}
            opacity={0.5}
          />
        </G>

        {/* Trees/Bushes - Right side */}
        <G>
          <Ellipse cx="375" cy="170" rx="30" ry="25" fill={fgColor} />
          <Ellipse
            cx="385"
            cy="178"
            rx="20"
            ry="18"
            fill={bgColor}
            opacity={0.5}
          />
          <Ellipse cx="355" cy="175" rx="25" ry="20" fill={fgColor} />
        </G>

        {/* Decorative bonsai trees in front */}
        <G>
          {/* Bonsai pots */}
          {[140, 175, 210, 245].map((x, i) => (
            <G key={`bonsai${i}`}>
              <Rect
                x={x - 5}
                y="182"
                width="10"
                height="8"
                fill={accentColor}
                opacity={0.7}
              />
              <Ellipse cx={x} cy="178" rx="8" ry="6" fill={fgColor} />
            </G>
          ))}
        </G>

        {/* Large decorative trees */}
        <G>
          <Ellipse cx="120" cy="168" rx="18" ry="15" fill={fgColor} />
          <Rect x="118" y="175" width="4" height="8" fill={accentColor} />

          <Ellipse cx="280" cy="168" rx="18" ry="15" fill={fgColor} />
          <Rect x="278" y="175" width="4" height="8" fill={accentColor} />
        </G>

        {/* Lamp posts */}
        <G opacity={0.6}>
          <Rect x="98" y="150" width="2" height="30" fill={accentColor} />
          <Circle cx="99" cy="148" r="3" fill={accentColor} />

          <Rect x="300" y="150" width="2" height="30" fill={accentColor} />
          <Circle cx="301" cy="148" r="3" fill={accentColor} />
        </G>
      </Svg>
    </View>
  );
};
