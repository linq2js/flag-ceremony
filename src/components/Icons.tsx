import React from "react";
import Svg, { Path, Circle, Rect, G, Line } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
}

// Eye icon - for "eyes on the flag"
export const EyeIcon: React.FC<IconProps> = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={12.5} r={3} stroke={color} strokeWidth={2} />
  </Svg>
);

// Hand raised icon - for salute
export const HandRaisedIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8V4C18 3.45 17.55 3 17 3C16.45 3 16 3.45 16 4V8"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M14 7V3C14 2.45 13.55 2 13 2C12.45 2 12 2.45 12 3V8"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M10 8V4C10 3.45 9.55 3 9 3C8.45 3 8 3.45 8 4V12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M20 12V8C20 7.45 19.55 7 19 7C18.45 7 18 7.45 18 8V12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M8 12V14C8 17.31 10.69 20 14 20C17.31 20 20 17.31 20 14V12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Five fingers icon
export const FingersIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2V8M8 3V9M16 3V9M6 6V14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14V6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 8V12C4 13.1 4.9 14 6 14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M20 8V12C20 13.1 19.1 14 18 14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Ruler/measurement icon - for 5cm
export const RulerIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 5L21 5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path
      d="M3 5V9M7 5V7M11 5V9M15 5V7M19 5V9M21 5V9"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M6 14L18 14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M6 14L6 19L18 19L18 14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Angle icon - for 45 degrees
export const AngleIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 20H20" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M4 20L16 4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path
      d="M4 20C4 16 6 14 10 14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Music note icon
export const MusicIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18V5L21 3V16"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={6} cy={18} r={3} stroke={color} strokeWidth={2} />
    <Circle cx={18} cy={16} r={3} stroke={color} strokeWidth={2} />
  </Svg>
);

// Heart icon - for patriotism
export const HeartIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 12 5C12.09 3.81 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 14 12 21 12 21Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
      fillOpacity={0.2}
    />
  </Svg>
);

// Handshake icon - for unity
export const HandshakeIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 11L9 9L12 12L17 7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 14L7 11M21 14L17 7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M3 14L6 17L10 15L14 19L17 16L21 14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Strength/muscle icon
export const StrengthIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 15C4 15 5 14 7 14C9 14 10 16 12 16C14 16 15 14 17 14C19 14 20 15 20 15"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M6 11V7C6 5.9 6.9 5 8 5H10C11.1 5 12 5.9 12 7V11"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 11V7C12 5.9 12.9 5 14 5H16C17.1 5 18 5.9 18 7V11"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Play icon - for start button
export const PlayIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 4L20 12L6 20V4Z"
      fill={color}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Home icon
export const HomeIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.55 5.45 21 6 21H9M19 10L21 12M19 10V20C19 20.55 18.55 21 18 21H15M9 21C9.55 21 10 20.55 10 20V16C10 15.45 10.45 15 11 15H13C13.55 15 14 15.45 14 16V20C14 20.55 14.45 21 15 21M9 21H15"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Stats/chart icon
export const StatsIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={4}
      y={13}
      width={4}
      height={8}
      rx={1}
      stroke={color}
      strokeWidth={2}
    />
    <Rect
      x={10}
      y={9}
      width={4}
      height={12}
      rx={1}
      stroke={color}
      strokeWidth={2}
    />
    <Rect
      x={16}
      y={4}
      width={4}
      height={17}
      rx={1}
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

// Settings/gear icon
export const SettingsIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={3.5} stroke={color} strokeWidth={2} />
    <Path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Fire/streak icon
export const FireIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fbbf24",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2Z"
      fill={color}
      fillOpacity={0.3}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 22C16.42 22 20 18.42 20 14C20 9 12 2 12 2C12 2 4 9 4 14C4 18.42 7.58 22 12 22Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Calendar icon
export const CalendarIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={3}
      y={4}
      width={18}
      height={18}
      rx={2}
      stroke={color}
      strokeWidth={2}
    />
    <Path d="M3 10H21" stroke={color} strokeWidth={2} />
    <Path
      d="M8 2V6M16 2V6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Target icon
export const TargetIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
    <Circle cx={12} cy={12} r={6} stroke={color} strokeWidth={2} />
    <Circle cx={12} cy={12} r={2} fill={color} />
  </Svg>
);

// Check icon
export const CheckIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 13L9 17L19 7"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Arrow right icon
export const ArrowRightIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12H19M19 12L13 6M19 12L13 18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Lightning/bolt icon - for quick actions
export const LightningIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fbbf24",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      fill={color}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Star icon - for ratings/achievements
export const StarIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fbbf24",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={color}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Share icon - for sharing app
export const ShareIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 12V20C4 20.55 4.45 21 5 21H19C19.55 21 20 20.55 20 20V12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 6L12 2L8 6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 2V15"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Download icon - for calendar export
export const DownloadIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15V19C21 19.55 20.55 20 20 20H4C3.45 20 3 19.55 3 19V15"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 10L12 15L17 10"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 15V3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Trophy icon - for achievements/longest streak
export const TrophyIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fbbf24",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9H4C3.45 9 3 8.55 3 8V5C3 4.45 3.45 4 4 4H6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 9H20C20.55 9 21 8.55 21 8V5C21 4.45 20.55 4 20 4H18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 4H18V12C18 15.31 15.31 18 12 18C8.69 18 6 15.31 6 12V4Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 18V21M8 21H16"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Globe icon - for language selection
export const GlobeIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
    <Path
      d="M2 12H22"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22C9.5 19.5 8 16 8 12C8 8 9.5 4.5 12 2Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Info icon - for about section
export const InfoIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
    <Path
      d="M12 16V12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Circle cx={12} cy={8} r={1} fill={color} />
  </Svg>
);

// Crown icon - for top achievements
export const CrownIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fbbf24",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 17L5 8L9 12L12 4L15 12L19 8L22 17H2Z"
      fill={color}
      fillOpacity={0.2}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 17H22V20C22 20.55 21.55 21 21 21H3C2.45 21 2 20.55 2 20V17Z"
      fill={color}
      fillOpacity={0.3}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Medal icon - for achievements
export const MedalIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fbbf24",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx={12}
      cy={14}
      r={6}
      fill={color}
      fillOpacity={0.2}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M9 2L12 8L15 2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 8V10"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Camera icon - for taking photos
export const CameraIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19C23 19.55 22.55 20 22 20H2C1.45 20 1 19.55 1 19V8C1 7.45 1.45 7 2 7H6L8 4H16L18 7H22C22.55 7 23 7.45 23 8V19Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={13} r={4} stroke={color} strokeWidth={2} />
  </Svg>
);

// Gallery/image icon - for choosing photos
export const GalleryIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={3}
      y={3}
      width={18}
      height={18}
      rx={2}
      stroke={color}
      strokeWidth={2}
    />
    <Circle cx={8.5} cy={8.5} r={1.5} fill={color} />
    <Path
      d="M21 15L16 10L5 21"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Close/X icon - for dismissing
export const CloseIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Back arrow icon - for navigation
export const BackIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// User icon - for profile/nickname
export const UserIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx="12"
      cy="7"
      r="4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Edit icon - for editing/cropping photos
export const EditIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Zoom in icon
export const ZoomInIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={11} cy={11} r={8} stroke={color} strokeWidth={2} />
    <Path
      d="M21 21L16.65 16.65"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11 8V14M8 11H14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Zoom out icon
export const ZoomOutIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={11} cy={11} r={8} stroke={color} strokeWidth={2} />
    <Path
      d="M21 21L16.65 16.65"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M8 11H14" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// Arrow left icon
export const ArrowLeftIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Arrow up icon
export const ArrowUpIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 19V5M12 5L5 12M12 5L19 12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Arrow down icon
export const ArrowDownIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M12 19L5 12M12 19L19 12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Reset/refresh icon
export const ResetIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3C8.5 3 5.5 5.5 4.5 8.5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 3V8.5H8.5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Feedback/message icon
export const FeedbackIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 10H8.01M12 10H12.01M16 10H16.01"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Send icon - for submitting feedback
export const SendIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#fff",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
