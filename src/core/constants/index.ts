import { Zikir } from '../types';

// Default Zikir List
export const DEFAULT_ZIKIRS: Omit<Zikir, 'id' | 'createdAt'>[] = [
    {
        name: 'Subhanallah',
        arabicText: 'سُبْحَانَ اللّٰهِ',
        transliteration: 'Subhanallah',
        count: 0,
        target: 33,
        isCustom: false,
    },
    {
        name: 'Elhamdulillah',
        arabicText: 'اَلْحَمْدُ لِلّٰهِ',
        transliteration: 'Elhamdulillah',
        count: 0,
        target: 33,
        isCustom: false,
    },
    {
        name: 'Allahu Ekber',
        arabicText: 'اَللّٰهُ اَكْبَرُ',
        transliteration: 'Allahu Ekber',
        count: 0,
        target: 34,
        isCustom: false,
    },
    {
        name: 'Estağfirullah',
        arabicText: 'اَسْتَغْفِرُ اللّٰهَ',
        transliteration: 'Estağfirullah',
        count: 0,
        target: 100,
        isCustom: false,
    },
    {
        name: 'La ilahe illallah',
        arabicText: 'لَا اِلٰهَ اِلَّا اللّٰهُ',
        transliteration: 'La ilahe illallah',
        count: 0,
        target: 100,
        isCustom: false,
    },
];

// Storage Keys
export const STORAGE_KEYS = {
    SETTINGS: '@zikirmatik_settings',
    SELECTED_ZIKIR: '@zikirmatik_selected_zikir',
    THEME: '@zikirmatik_theme',
    LANGUAGE: '@zikirmatik_language',
    ONBOARDING_COMPLETE: '@zikirmatik_onboarding',
} as const;

// Database Constants
export const DB_NAME = 'zikirmatik.db';
export const DB_VERSION = 1;

// Animation Durations
export const ANIMATION_DURATION = {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
} as const;

// Haptic Feedback Types
export const HAPTIC_TYPES = {
    LIGHT: 'light',
    MEDIUM: 'medium',
    HEAVY: 'heavy',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
} as const;

// Default Settings
export const DEFAULT_SETTINGS = {
    theme: 'auto' as const,
    language: 'tr' as const,
    soundEnabled: true,
    hapticEnabled: true,
    notificationsEnabled: true,
};
