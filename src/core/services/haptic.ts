import * as Haptics from 'expo-haptics';

class HapticService {
    private enabled: boolean = true;

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    async light(): Promise<void> {
        if (!this.enabled) return;
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
            console.error('Haptic feedback error:', error);
        }
    }

    async medium(): Promise<void> {
        if (!this.enabled) return;
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (error) {
            console.error('Haptic feedback error:', error);
        }
    }

    async heavy(): Promise<void> {
        if (!this.enabled) return;
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } catch (error) {
            console.error('Haptic feedback error:', error);
        }
    }

    async success(): Promise<void> {
        if (!this.enabled) return;
        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error('Haptic feedback error:', error);
        }
    }

    async warning(): Promise<void> {
        if (!this.enabled) return;
        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } catch (error) {
            console.error('Haptic feedback error:', error);
        }
    }

    async error(): Promise<void> {
        if (!this.enabled) return;
        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } catch (error) {
            console.error('Haptic feedback error:', error);
        }
    }

    async selection(): Promise<void> {
        if (!this.enabled) return;
        try {
            await Haptics.selectionAsync();
        } catch (error) {
            console.error('Haptic feedback error:', error);
        }
    }
}

export const hapticService = new HapticService();
