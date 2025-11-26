import { PrayerCategory } from '../types';

// Prayer Categories with Turkish labels and icons
export const PRAYER_CATEGORIES: Record<PrayerCategory, { tr: string; en: string; icon: string }> = {
    namaz: { tr: 'Namaz Duaları', en: 'Prayer Duas', icon: 'book' },
    sabah_aksam: { tr: 'Sabah/Akşam Ezkarı', en: 'Morning/Evening', icon: 'sunny' },
    yemek: { tr: 'Yemek Duaları', en: 'Food Duas', icon: 'restaurant' },
    yolculuk: { tr: 'Yolculuk Duaları', en: 'Travel Duas', icon: 'car' },
    gunluk: { tr: 'Günlük Dualar', en: 'Daily Duas', icon: 'calendar' },
    quran: { tr: 'Kur\'an\'dan Dualar', en: 'Quranic Duas', icon: 'book-outline' },
    hastalik: { tr: 'Hastalık Duaları', en: 'Healing Duas', icon: 'medical' },
    istighfar: { tr: 'İstiğfar', en: 'Istighfar', icon: 'heart' },
} as const;
