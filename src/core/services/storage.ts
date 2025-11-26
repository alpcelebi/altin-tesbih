import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../constants';

class StorageService {
    /**
     * Get app settings
     */
    async getSettings(): Promise<AppSettings> {
        try {
            const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
            if (settingsJson) {
                return JSON.parse(settingsJson);
            }
            return DEFAULT_SETTINGS;
        } catch (error) {
            console.error('Error loading settings:', error);
            return DEFAULT_SETTINGS;
        }
    }

    /**
     * Save app settings
     */
    async saveSettings(settings: AppSettings): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
            throw error;
        }
    }

    /**
     * Update partial settings
     */
    async updateSettings(partialSettings: Partial<AppSettings>): Promise<AppSettings> {
        try {
            const currentSettings = await this.getSettings();
            const updatedSettings = { ...currentSettings, ...partialSettings };
            await this.saveSettings(updatedSettings);
            return updatedSettings;
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    }

    /**
     * Get selected zikir ID
     */
    async getSelectedZikirId(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_ZIKIR);
        } catch (error) {
            console.error('Error loading selected zikir:', error);
            return null;
        }
    }

    /**
     * Save selected zikir ID
     */
    async saveSelectedZikirId(zikirId: string): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_ZIKIR, zikirId);
        } catch (error) {
            console.error('Error saving selected zikir:', error);
            throw error;
        }
    }

    /**
     * Check if onboarding is complete
     */
    async isOnboardingComplete(): Promise<boolean> {
        try {
            const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
            return value === 'true';
        } catch (error) {
            console.error('Error checking onboarding status:', error);
            return false;
        }
    }

    /**
     * Mark onboarding as complete
     */
    async completeOnboarding(): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
        } catch (error) {
            console.error('Error marking onboarding complete:', error);
            throw error;
        }
    }

    /**
     * Clear all data (for testing/reset)
     */
    async clearAll(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
            throw error;
        }
    }
}

export const storageService = new StorageService();
