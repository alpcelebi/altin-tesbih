# Zikirmatik & Prayer Times App

A premium, feature-rich Zikirmatik and Prayer Times application built with React Native (Expo), TypeScript, and SQLite.

## Features

- **Zikirmatik**: Advanced counter with haptic feedback, target setting, and history tracking.
- **Prayer Times**: Accurate prayer times using Diyanet API with offline fallback (Adhan).
- **Statistics**: Visual history of your zikirs.
- **Settings**: Dark/Light mode, English/Turkish language support, and customization.
- **Premium UI**: Smooth animations, glassmorphism effects, and clean design.

## Tech Stack

- **Framework**: React Native (Expo SDK 50)
- **Language**: TypeScript
- **State Management**: Zustand
- **Database**: Expo SQLite (Next Gen)
- **Navigation**: React Navigation (Bottom Tabs)
- **UI**: StyleSheet, Reanimated, Linear Gradient
- **Ads**: React Native Google Mobile Ads

## Project Structure

```
src/
├── core/           # Core logic (Database, Services, Types, Constants)
├── features/       # Feature-based modules (Screens, Components)
├── shared/         # Shared UI components and utilities
├── store/          # Zustand state management stores
├── navigation/     # Navigation configuration
├── locales/        # i18n translation files
└── theme/          # Theme configuration (Light/Dark)
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the App**:
   ```bash
   npx expo start
   ```

3. **Build for Production**:
   ```bash
   eas build
   ```

## Notes

- The app uses a local SQLite database.
- AdMob is configured with test IDs. Update `src/shared/ui/Screen.tsx` with real Ad Unit IDs for production.
- Diyanet API is used for prayer times, with a fallback to local calculation if offline.
