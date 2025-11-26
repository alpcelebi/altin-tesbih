import * as SQLite from 'expo-sqlite';
import { Zikir, ZikirHistory, Prayer } from '../types';
import { DEFAULT_ZIKIRS } from '../constants';
import { DEFAULT_PRAYERS } from '../../data/prayers';

class DatabaseService {
    private db: SQLite.SQLiteDatabase | null = null;
    private isInitialized = false;

    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            this.db = await SQLite.openDatabaseAsync('zikirmatik.db');
            await this.createTables();
            await this.seedDefaultZikirs();
            await this.seedDefaultPrayers();
            this.isInitialized = true;
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization error:', error);
            throw new Error('Failed to initialize database');
        }
    }

    private async createTables(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS zikirs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        arabicText TEXT,
        transliteration TEXT,
        count INTEGER DEFAULT 0,
        target INTEGER DEFAULT 33,
        isCustom INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS zikir_history (
        id TEXT PRIMARY KEY,
        zikirId TEXT NOT NULL,
        zikirName TEXT NOT NULL,
        count INTEGER NOT NULL,
        date TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (zikirId) REFERENCES zikirs(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS prayers (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        title_tr TEXT NOT NULL,
        title_en TEXT,
        title_ar TEXT,
        arabic_text TEXT NOT NULL,
        turkish_translation TEXT NOT NULL,
        english_translation TEXT,
        transliteration TEXT NOT NULL,
        source TEXT NOT NULL,
        source_detail TEXT,
        is_favorite INTEGER DEFAULT 0,
        display_order INTEGER DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS idx_history_date ON zikir_history(date);
      CREATE INDEX IF NOT EXISTS idx_history_zikir ON zikir_history(zikirId);
      CREATE INDEX IF NOT EXISTS idx_prayers_category ON prayers(category);
      CREATE INDEX IF NOT EXISTS idx_prayers_favorite ON prayers(is_favorite);
    `);
    }

    private async seedDefaultZikirs(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const existingZikirs = await this.db.getAllAsync<Zikir>('SELECT * FROM zikirs WHERE isCustom = 0');

        if (existingZikirs.length === 0) {
            for (const zikir of DEFAULT_ZIKIRS) {
                await this.db.runAsync(
                    `INSERT INTO zikirs (id, name, arabicText, transliteration, count, target, isCustom, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        this.generateId(),
                        zikir.name,
                        zikir.arabicText || '',
                        zikir.transliteration || '',
                        zikir.count,
                        zikir.target,
                        zikir.isCustom ? 1 : 0,
                        new Date().toISOString(),
                    ]
                );
            }
            console.log('Default zikirs seeded');
        }
    }

    private async seedDefaultPrayers(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        // Check existing count
        const result = await this.db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM prayers');
        const count = result?.count || 0;

        if (count < DEFAULT_PRAYERS.length) {
            console.log(`Seeding missing prayers... (Current: ${count}, Target: ${DEFAULT_PRAYERS.length})`);

            const existingPrayers = await this.db.getAllAsync<Prayer>('SELECT title_tr FROM prayers');
            const existingTitles = new Set(existingPrayers.map(p => p.title_tr));

            let addedCount = 0;
            for (const prayer of DEFAULT_PRAYERS) {
                if (!existingTitles.has(prayer.title_tr)) {
                    await this.db.runAsync(
                        `INSERT INTO prayers (id, category, title_tr, title_en, title_ar, arabic_text, turkish_translation, english_translation, transliteration, source, source_detail, is_favorite, display_order)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            this.generateId(),
                            prayer.category,
                            prayer.title_tr,
                            prayer.title_en || '',
                            prayer.title_ar || '',
                            prayer.arabic_text,
                            prayer.turkish_translation,
                            prayer.english_translation || '',
                            prayer.transliteration,
                            prayer.source,
                            prayer.source_detail || '',
                            0,
                            prayer.display_order,
                        ]
                    );
                    addedCount++;
                }
            }
            console.log(`✅ ${addedCount} new prayers added successfully`);
        }
    }

    // Zikir Operations
    async getAllZikirs(): Promise<Zikir[]> {
        if (!this.db) throw new Error('Database not initialized');

        const rows = await this.db.getAllAsync<any>('SELECT * FROM zikirs ORDER BY createdAt ASC');
        return rows.map(row => ({
            ...row,
            isCustom: Boolean(row.isCustom),
        }));
    }

    async getZikirById(id: string): Promise<Zikir | null> {
        if (!this.db) throw new Error('Database not initialized');

        const row = await this.db.getFirstAsync<any>('SELECT * FROM zikirs WHERE id = ?', [id]);
        if (!row) return null;

        return {
            ...row,
            isCustom: Boolean(row.isCustom),
        };
    }

    async createZikir(zikir: Omit<Zikir, 'id' | 'createdAt'>): Promise<Zikir> {
        if (!this.db) throw new Error('Database not initialized');

        const id = this.generateId();
        const createdAt = new Date().toISOString();

        await this.db.runAsync(
            `INSERT INTO zikirs (id, name, arabicText, transliteration, count, target, isCustom, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                zikir.name,
                zikir.arabicText || '',
                zikir.transliteration || '',
                zikir.count,
                zikir.target,
                zikir.isCustom ? 1 : 0,
                createdAt,
            ]
        );

        return { ...zikir, id, createdAt };
    }

    async updateZikirCount(id: string, count: number): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.runAsync('UPDATE zikirs SET count = ? WHERE id = ?', [count, id]);
    }

    async updateZikirTarget(id: string, target: number): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.runAsync('UPDATE zikirs SET target = ? WHERE id = ?', [target, id]);
    }

    async resetZikirCount(id: string): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.runAsync('UPDATE zikirs SET count = 0 WHERE id = ?', [id]);
    }

    async deleteZikir(id: string): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.runAsync('DELETE FROM zikirs WHERE id = ?', [id]);
    }

    // Zikir History Operations
    async saveZikirHistory(zikirId: string, zikirName: string, count: number): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const id = this.generateId();
        const date = new Date().toISOString().split('T')[0];
        const timestamp = Date.now();

        await this.db.runAsync(
            `INSERT INTO zikir_history (id, zikirId, zikirName, count, date, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [id, zikirId, zikirName, count, date, timestamp]
        );
    }

    async getZikirHistory(limit: number = 50): Promise<ZikirHistory[]> {
        if (!this.db) throw new Error('Database not initialized');

        return await this.db.getAllAsync<ZikirHistory>(
            'SELECT * FROM zikir_history ORDER BY timestamp DESC LIMIT ?',
            [limit]
        );
    }

    async getZikirHistoryByDate(startDate: string, endDate: string): Promise<ZikirHistory[]> {
        if (!this.db) throw new Error('Database not initialized');

        return await this.db.getAllAsync<ZikirHistory>(
            'SELECT * FROM zikir_history WHERE date BETWEEN ? AND ? ORDER BY timestamp DESC',
            [startDate, endDate]
        );
    }

    async getTotalZikirCount(): Promise<number> {
        if (!this.db) throw new Error('Database not initialized');

        const result = await this.db.getFirstAsync<{ total: number }>(
            'SELECT COALESCE(SUM(count), 0) as total FROM zikir_history'
        );

        return result?.total || 0;
    }

    async getDailyZikirCount(date: string): Promise<number> {
        if (!this.db) throw new Error('Database not initialized');

        const result = await this.db.getFirstAsync<{ total: number }>(
            'SELECT COALESCE(SUM(count), 0) as total FROM zikir_history WHERE date = ?',
            [date]
        );

        return result?.total || 0;
    }

    async deleteZikirHistory(id: string): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.runAsync('DELETE FROM zikir_history WHERE id = ?', [id]);
    }

    // Prayer Operations
    async getAllPrayers(): Promise<Prayer[]> {
        if (!this.db) throw new Error('Database not initialized');

        const rows = await this.db.getAllAsync<any>('SELECT * FROM prayers ORDER BY category, display_order');
        return rows.map(row => ({
            ...row,
            is_favorite: Boolean(row.is_favorite),
        }));
    }

    async getPrayersByCategory(category: string): Promise<Prayer[]> {
        if (!this.db) throw new Error('Database not initialized');

        const rows = await this.db.getAllAsync<any>(
            'SELECT * FROM prayers WHERE category = ? ORDER BY display_order',
            [category]
        );
        return rows.map(row => ({
            ...row,
            is_favorite: Boolean(row.is_favorite),
        }));
    }

    async searchPrayers(query: string): Promise<Prayer[]> {
        if (!this.db) throw new Error('Database not initialized');

        const searchQuery = `%${query}%`;
        const rows = await this.db.getAllAsync<any>(
            `SELECT * FROM prayers 
       WHERE title_tr LIKE ? OR arabic_text LIKE ? OR turkish_translation LIKE ? OR transliteration LIKE ?
       ORDER BY category, display_order`,
            [searchQuery, searchQuery, searchQuery, searchQuery]
        );
        return rows.map(row => ({
            ...row,
            is_favorite: Boolean(row.is_favorite),
        }));
    }

    async togglePrayerFavorite(id: string): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.runAsync(
            'UPDATE prayers SET is_favorite = NOT is_favorite WHERE id = ?',
            [id]
        );
    }

    async getFavoritePrayers(): Promise<Prayer[]> {
        if (!this.db) throw new Error('Database not initialized');

        const rows = await this.db.getAllAsync<any>(
            'SELECT * FROM prayers WHERE is_favorite = 1 ORDER BY category, display_order'
        );
        return rows.map(row => ({
            ...row,
            is_favorite: Boolean(row.is_favorite),
        }));
    }

    // Utility
    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    async resetDatabase(): Promise<void> {
        if (__DEV__) {
            if (this.db) {
                await this.db.closeAsync();
                this.db = null;
            }
            try {
                await SQLite.deleteDatabaseAsync('zikirmatik.db');
                console.log('Database reset successfully');
            } catch (error) {
                console.warn('Failed to delete database:', error);
            }
            this.isInitialized = false;
        } else {
            console.warn('Database reset is only available in development mode.');
        }
    }

    async close(): Promise<void> {
        if (this.db) {
            await this.db.closeAsync();
            this.db = null;
            this.isInitialized = false;
        }
    }
}

export const databaseService = new DatabaseService();
