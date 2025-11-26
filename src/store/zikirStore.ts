import { create } from 'zustand';
import { Zikir } from '../core/types';
import { databaseService } from '../core/database';
import { storageService } from '../core/services';
import { hapticService } from '../core/services/haptic';

interface ZikirState {
    zikirs: Zikir[];
    selectedZikir: Zikir | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    loadZikirs: () => Promise<void>;
    selectZikir: (zikir: Zikir) => Promise<void>;
    incrementCount: () => Promise<void>;
    decrementCount: () => Promise<void>;
    resetCount: () => Promise<void>;
    updateTarget: (target: number) => Promise<void>;
    saveToHistory: () => Promise<void>;
    createCustomZikir: (name: string, arabicText?: string, target?: number) => Promise<void>;
    deleteZikir: (id: string) => Promise<void>;
}

export const useZikirStore = create<ZikirState>((set, get) => ({
    zikirs: [],
    selectedZikir: null,
    isLoading: false,
    error: null,

    loadZikirs: async () => {
        set({ isLoading: true, error: null });
        try {
            const zikirs = await databaseService.getAllZikirs();
            const selectedZikirId = await storageService.getSelectedZikirId();

            let selectedZikir = zikirs[0] || null;
            if (selectedZikirId) {
                const found = zikirs.find(z => z.id === selectedZikirId);
                if (found) selectedZikir = found;
            }

            set({ zikirs, selectedZikir, isLoading: false });
        } catch (error) {
            console.error('Error loading zikirs:', error);
            set({ error: 'Failed to load zikirs', isLoading: false });
        }
    },

    selectZikir: async (zikir: Zikir) => {
        try {
            await storageService.saveSelectedZikirId(zikir.id);
            set({ selectedZikir: zikir });
            await hapticService.selection();
        } catch (error) {
            console.error('Error selecting zikir:', error);
        }
    },

    incrementCount: async () => {
        const { selectedZikir, zikirs } = get();
        if (!selectedZikir) return;

        const newCount = selectedZikir.count + 1;
        const updatedZikir = { ...selectedZikir, count: newCount };

        try {
            await databaseService.updateZikirCount(selectedZikir.id, newCount);

            // Update state
            const updatedZikirs = zikirs.map(z =>
                z.id === selectedZikir.id ? updatedZikir : z
            );

            set({ selectedZikir: updatedZikir, zikirs: updatedZikirs });

            // Haptic feedback
            await hapticService.light();

            // Check if target reached
            if (newCount === selectedZikir.target) {
                await hapticService.success();
            }
        } catch (error) {
            console.error('Error incrementing count:', error);
        }
    },

    decrementCount: async () => {
        const { selectedZikir, zikirs } = get();
        if (!selectedZikir || selectedZikir.count === 0) return;

        const newCount = selectedZikir.count - 1;
        const updatedZikir = { ...selectedZikir, count: newCount };

        try {
            await databaseService.updateZikirCount(selectedZikir.id, newCount);

            const updatedZikirs = zikirs.map(z =>
                z.id === selectedZikir.id ? updatedZikir : z
            );

            set({ selectedZikir: updatedZikir, zikirs: updatedZikirs });
            await hapticService.light();
        } catch (error) {
            console.error('Error decrementing count:', error);
        }
    },

    resetCount: async () => {
        const { selectedZikir, zikirs } = get();
        if (!selectedZikir) return;

        const updatedZikir = { ...selectedZikir, count: 0 };

        try {
            await databaseService.resetZikirCount(selectedZikir.id);

            const updatedZikirs = zikirs.map(z =>
                z.id === selectedZikir.id ? updatedZikir : z
            );

            set({ selectedZikir: updatedZikir, zikirs: updatedZikirs });
            await hapticService.medium();
        } catch (error) {
            console.error('Error resetting count:', error);
        }
    },

    updateTarget: async (target: number) => {
        const { selectedZikir, zikirs } = get();
        if (!selectedZikir) return;

        const updatedZikir = { ...selectedZikir, target };

        try {
            await databaseService.updateZikirTarget(selectedZikir.id, target);

            const updatedZikirs = zikirs.map(z =>
                z.id === selectedZikir.id ? updatedZikir : z
            );

            set({ selectedZikir: updatedZikir, zikirs: updatedZikirs });
            await hapticService.selection();
        } catch (error) {
            console.error('Error updating target:', error);
        }
    },

    saveToHistory: async () => {
        const { selectedZikir } = get();
        if (!selectedZikir || selectedZikir.count === 0) return;

        try {
            await databaseService.saveZikirHistory(
                selectedZikir.id,
                selectedZikir.name,
                selectedZikir.count
            );

            // Reset count after saving
            await get().resetCount();
            await hapticService.success();
        } catch (error) {
            console.error('Error saving to history:', error);
        }
    },

    createCustomZikir: async (name: string, arabicText?: string, target: number = 33) => {
        try {
            const newZikir = await databaseService.createZikir({
                name,
                arabicText,
                transliteration: name,
                count: 0,
                target,
                isCustom: true,
            });

            const { zikirs } = get();
            set({ zikirs: [...zikirs, newZikir] });
            await hapticService.success();
        } catch (error) {
            console.error('Error creating custom zikir:', error);
            throw error;
        }
    },

    deleteZikir: async (id: string) => {
        const { zikirs, selectedZikir } = get();

        try {
            await databaseService.deleteZikir(id);

            const updatedZikirs = zikirs.filter(z => z.id !== id);
            let newSelectedZikir = selectedZikir;

            if (selectedZikir?.id === id) {
                newSelectedZikir = updatedZikirs[0] || null;
                if (newSelectedZikir) {
                    await storageService.saveSelectedZikirId(newSelectedZikir.id);
                }
            }

            set({ zikirs: updatedZikirs, selectedZikir: newSelectedZikir });
            await hapticService.medium();
        } catch (error) {
            console.error('Error deleting zikir:', error);
            throw error;
        }
    },
}));
