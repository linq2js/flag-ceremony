# 🇻🇳 Flag Ceremony App

A beautiful Expo app for daily flag ceremony practice. Build your discipline, track your streaks, and honor your flag every day.

## Features

- **Home Screen**: View today's historical events and start your ceremony
- **Flag Ceremony**: Animated flag raising with audio playback
- **Stats Screen**: Track your streaks, monthly ceremonies, and global ranking
- **Settings**: Set up daily reminders and customize your experience

## Tech Stack

- **Expo** - React Native development platform
- **Storion** - Lightweight state management
- **NativeWind** - Tailwind CSS for React Native
- **expo-router** - File-based navigation
- **react-native-reanimated** - Smooth animations

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Device

- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go
- **Web**: Press `w` in the terminal

## Adding Ceremony Audio

To add your flag ceremony audio:

1. Place your audio file in `assets/audio/`
2. Name it `flag-ceremony.mp3`
3. The app will automatically play it during the ceremony

If no audio file is present, the ceremony will run for 10 seconds with the flag animation.

## Project Structure

```
flag-ceremony/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Tab navigation layout
│   ├── index.tsx           # Home screen
│   ├── ceremony.tsx        # Flag ceremony screen
│   ├── stats.tsx           # Statistics screen
│   └── settings.tsx        # Settings screen
├── src/
│   ├── components/         # Reusable components
│   │   ├── Flag.tsx        # Animated flag component
│   │   ├── Button.tsx      # Custom button component
│   │   ├── HistoryCard.tsx # Historical events card
│   │   └── StatsCard.tsx   # Stats display card
│   ├── store/              # Storion state management
│   │   ├── index.ts        # Store definition and actions
│   │   └── types.ts        # TypeScript types
│   └── utils/              # Utility functions
│       ├── history.ts      # Historical events data
│       └── notifications.ts # Push notification helpers
├── assets/
│   └── audio/              # Audio files (add flag-ceremony.mp3)
└── global.css              # Tailwind global styles
```

## Features Explained

### Streak Tracking
- Consecutive days are tracked automatically
- Streaks reset if you miss a day
- Your longest streak is saved forever

### Daily Reminders
- Set custom reminder times
- Choose which days to receive notifications
- Notifications work on iOS and Android

### Rankings
- Simulated global ranking system
- Based on total ceremonies completed
- Rankings update in real-time

## License

MIT

