import { create } from 'zustand';
import { AppSettings, ThemeMode } from '../core/types';
import { storageService } from '../core/services';
import { DEFAULT_SETTINGS } from '../core/constants';
import { hapticService } from '../core/services/haptic';
import { useColorScheme } from 'react-native';

interface SettingsState {
    settings: AppSettings;
    isLoading: boolean;

    // Actions
    loadSettings: () => Promise<void>;
    updateSettings: (partialSettings: Partial<AppSettings>) => Promise<void>;
    toggleTheme: () => Promise<void>;
    toggleLanguage: () => Promise<void>;
    toggleSound: () => Promise<void>;
    toggleHaptic: () => Promise<void>;
    toggleNotifications: () => Promise<void>;
    getCurrentTheme: () => ThemeMode;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: DEFAULT_SETTINGS,
    isLoading: false,

    loadSettings: async () => {
        set({ isLoading: true });
        try {
            const settings = await storageService.getSettings();
            set({ settings, isLoading: false });

            // Apply haptic setting
            hapticService.setEnabled(settings.hapticEnabled);
        } catch (error) {
            console.error('Error loading settings:', error);
            set({ isLoading: false });
        }
    },

    updateSettings: async (partialSettings: Partial<AppSettings>) => {
        try {
            const updatedSettings = await storageService.updateSettings(partialSettings);
            set({ settings: updatedSettings });

            // Apply haptic setting if changed
            if ('hapticEnabled' in partialSettings) {
                hapticService.setEnabled(partialSettings.hapticEnabled!);
            }

            await hapticService.selection();
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    },

    toggleTheme: async () => {
        const { settings } = get();
        const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(settings.theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];

        await get().updateSettings({ theme: nextTheme });
    },

    toggleLanguage: async () => {
        const { settings } = get();
        const newLanguage = settings.language === 'tr' ? 'en' : 'tr';
        await get().updateSettings({ language: newLanguage });
    },

    toggleSound: async () => {
        const { settings } = get();
        await get().updateSettings({ soundEnabled: !settings.soundEnabled });
    },

    toggleHaptic: async () => {
        const { settings } = get();
        await get().updateSettings({ hapticEnabled: !settings.hapticEnabled });
    },

    toggleNotifications: async () => {
        const { settings } = get();
        await get().updateSettings({ notificationsEnabled: !settings.notificationsEnabled });
    },

    getCurrentTheme: (): ThemeMode => {
        const { settings } = get();
        if (settings.theme === 'auto') {
            // This will be handled in the component using useColorScheme
            return 'light'; // default
        }
        return settings.theme;
    },
}));
