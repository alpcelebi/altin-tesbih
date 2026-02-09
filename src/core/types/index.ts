// Core Types for the Application

export interface Zikir {
    id: string;
    name: string;
    arabicText?: string;
    transliteration?: string;
    count: number;
    target: number;
    isCustom: boolean;
    createdAt: string;
}

export interface ZikirHistory {
    id: string;
    zikirId: string;
    zikirName: string;
    count: number;
    date: string;
    timestamp: number;
}

// Islamic Prayers
export interface Prayer {
    id: string;
    category: PrayerCategory;
    title_tr: string;
    title_en?: string;
    title_ar?: string;
    arabic_text: string;
    turkish_translation: string;
    english_translation?: string;
    transliteration: string;
    source: 'Quran' | 'Hadith' | 'Masnun' | 'Aqidah' | 'Dua';
    source_detail?: string;
    is_favorite: boolean;
    display_order: number;
}

export type PrayerCategory =
    | 'namaz'           // Namaz Duaları
    | 'sabah_aksam'     // Sabah/Akşam Ezkarı
    | 'yemek'           // Yemek Duaları
    | 'yolculuk'        // Yolculuk Duaları
    | 'gunluk'          // Günlük Dualar
    | 'quran'           // Kur'an'dan Dualar
    | 'hastalik'        // Hastalık Duaları
    | 'istighfar';      // İstiğfar/Tövbe



export interface AppSettings {
    theme: 'light' | 'dark' | 'auto';
    language: 'tr' | 'en';
    soundEnabled: boolean;
    hapticEnabled: boolean;
    notificationsEnabled: boolean;
}

export interface Statistics {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
    streak: number;
}

export type ThemeMode = 'light' | 'dark';

export interface City {
    id: string;
    name: string;
    stateName: string;
    latitude: number;
    longitude: number;
}

export interface Theme {
    colors: {
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        card: string;
        text: string;
        textSecondary: string;
        border: string;
        error: string;
        success: string;
        warning: string;
        gradient: {
            start: string;
            end: string;
        };
    };
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    borderRadius: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
        full: number;
    };
    typography: {
        h1: number;
        h2: number;
        h3: number;
        h4: number;
        body: number;
        caption: number;
    };
}
