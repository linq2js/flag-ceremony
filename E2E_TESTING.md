# E2E Testing with Maestro

This project uses [Maestro](https://maestro.mobile.dev/) for E2E (End-to-End) testing. Maestro is a mobile UI testing framework that uses simple YAML-based test definitions and works seamlessly with Expo.

## Prerequisites

### Install Maestro CLI

```bash
# macOS (recommended)
curl -Ls "https://get.maestro.mobile.dev" | bash

# Or with Homebrew
brew tap mobile-dev-inc/tap
brew install maestro
```

### Verify Installation

```bash
maestro --version
```

### Requirements

- **iOS**: macOS with Xcode and iOS Simulator
- **Android**: Android Studio with Android Emulator or physical device with USB debugging enabled

## Running Tests

### Start the Expo Development Server

First, start the Expo dev server in one terminal:

```bash
npm start
```

### Run Tests

Open a new terminal and run:

```bash
# Run all E2E tests
npm run e2e

# Run only smoke tests (quick validation)
npm run e2e:smoke

# Record new test flows interactively
npm run e2e:record
```

### Running Individual Test Flows

```bash
# Run a specific test file
maestro test .maestro/flows/home.yaml

# Run with verbose output
maestro test .maestro/flows/home.yaml --debug-output
```

## Test Structure

```
.maestro/
├── config.yaml          # Global Maestro configuration
└── flows/
    ├── home.yaml           # Home screen tests
    ├── navigation.yaml     # Tab navigation tests
    ├── ceremony-start.yaml # Start ceremony flow
    ├── ceremony-via-status-card.yaml  # Alternative ceremony entry
    └── settings-language.yaml         # Language settings tests
```

## Test Tags

Tests are organized with tags for selective execution:

| Tag          | Description                           |
| ------------ | ------------------------------------- |
| `smoke`      | Quick validation tests (run on every PR) |
| `regression` | Full test suite                       |
| `home`       | Home screen related tests             |
| `ceremony`   | Flag ceremony related tests           |
| `navigation` | Navigation related tests              |
| `settings`   | Settings related tests                |

### Running Tests by Tag

```bash
# Run smoke tests only
maestro test .maestro/flows --include-tags smoke

# Run all ceremony tests
maestro test .maestro/flows --include-tags ceremony

# Exclude certain tags
maestro test .maestro/flows --exclude-tags regression
```

## Writing New Tests

### Basic Flow Structure

```yaml
# Flow metadata
appId: com.flagceremony.app
tags:
  - smoke
  - my-feature

---

# Test steps
- launchApp

- assertVisible:
    id: "element-test-id"

- tapOn:
    id: "button-test-id"

- takeScreenshot: screenshot_name
```

### Common Commands

| Command | Description |
|---------|-------------|
| `launchApp` | Launch the app |
| `assertVisible` | Assert element is visible |
| `assertNotVisible` | Assert element is not visible |
| `tapOn` | Tap on an element |
| `scrollUntilVisible` | Scroll until element is visible |
| `inputText` | Enter text in a field |
| `takeScreenshot` | Capture a screenshot |
| `waitForAnimationToEnd` | Wait for animations |

### Element Selection

Always use `testID` for reliable element selection:

```yaml
# By testID (recommended)
- tapOn:
    id: "my-button"

# By text (fallback)
- tapOn:
    text: "Start Ceremony"

# By index (last resort)
- tapOn:
    text: "Button"
    index: 0
```

## Adding testID to Components

When adding new interactive elements, include `testID` and `accessibilityLabel`:

```tsx
<TouchableOpacity
  testID="my-button"
  accessibilityLabel="my-button"
  onPress={handlePress}
>
  <Text>Click Me</Text>
</TouchableOpacity>
```

For custom components, pass through the `testID` prop:

```tsx
interface ButtonProps {
  testID?: string;
  // ... other props
}

export const Button: React.FC<ButtonProps> = ({ testID, ...props }) => (
  <TouchableOpacity
    testID={testID}
    accessibilityLabel={testID}
    {...props}
  />
);
```

## Available Test IDs

### Navigation

- `tab-home` - Home tab
- `tab-ceremony` - Ceremony tab
- `tab-stats` - Stats tab
- `tab-settings` - Settings tab

### Home Screen

- `home-screen` - Home screen container
- `app-title` - App title text
- `vietnam-flag` - Vietnam flag hero
- `status-card` - Tappable status card
- `streak-stat` - Current streak stats card
- `week-stat` - This week stats card
- `history-card` - Historical events card
- `start-ceremony-btn` - Start ceremony CTA button

### Ceremony Screen

- `ceremony-screen` - Ceremony screen container
- `ceremony-ready-view` - Ready state view
- `start-ceremony-action` - Start ceremony button
- `countdown-view` - Countdown view

### Settings Screen

- `settings-screen` - Settings screen container
- `language-section` - Language settings section
- `language-vi` - Vietnamese language option
- `language-en` - English language option
- `language-vi-selected` - Vietnamese selected indicator
- `language-en-selected` - English selected indicator

### Stats Screen

- `stats-screen` - Stats screen container

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Install Maestro
        run: |
          curl -Ls "https://get.maestro.mobile.dev" | bash
          export PATH="$PATH:$HOME/.maestro/bin"
          
      - name: Start Expo (background)
        run: npm start &
        
      - name: Wait for Expo
        run: sleep 30
        
      - name: Run E2E smoke tests
        run: maestro test .maestro/flows --include-tags smoke
```

## Debugging

### View Test Output

```bash
# Run with debug output
maestro test .maestro/flows/home.yaml --debug-output ./debug

# View hierarchy
maestro hierarchy
```

### Common Issues

1. **Element not found**: Ensure `testID` is properly set and the element is rendered
2. **Timing issues**: Use `waitForAnimationToEnd` or explicit waits
3. **App not launching**: Ensure the Expo dev server is running

## Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro CLI Reference](https://maestro.mobile.dev/cli/commands)
- [Expo Testing Guide](https://docs.expo.dev/guides/testing/)

