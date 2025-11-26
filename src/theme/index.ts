import { Theme } from '../core/types';

export const lightTheme: Theme = {
    colors: {
        primary: '#2E7D32', // Islamic Green
        secondary: '#FFB300', // Gold
        background: '#F5F5F5',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        text: '#1A1A1A',
        textSecondary: '#666666',
        border: '#E0E0E0',
        error: '#D32F2F',
        success: '#388E3C',
        warning: '#F57C00',
        gradient: {
            start: '#2E7D32',
            end: '#66BB6A',
        },
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 16,
        xl: 24,
        full: 9999,
    },
    typography: {
        h1: 32,
        h2: 28,
        h3: 24,
        h4: 20,
        body: 16,
        caption: 14,
    },
};

export const darkTheme: Theme = {
    colors: {
        primary: '#66BB6A', // Lighter Islamic Green for dark mode
        secondary: '#FFD54F', // Lighter Gold
        background: '#121212',
        surface: '#1E1E1E',
        card: '#2C2C2C',
        text: '#FFFFFF',
        textSecondary: '#B0B0B0',
        border: '#3A3A3A',
        error: '#EF5350',
        success: '#66BB6A',
        warning: '#FFA726',
        gradient: {
            start: '#1B5E20',
            end: '#388E3C',
        },
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 16,
        xl: 24,
        full: 9999,
    },
    typography: {
        h1: 32,
        h2: 28,
        h3: 24,
        h4: 20,
        body: 16,
        caption: 14,
    },
};
