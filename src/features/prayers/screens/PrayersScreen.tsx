import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Prayer, PrayerCategory } from '../../../core/types';
import { useTheme, useTranslation } from '../../../core/hooks';
import { databaseService } from '../../../core/database';
import { PrayerCard } from '../components/PrayerCard';
import { PRAYER_CATEGORIES } from '../../../core/constants/prayers';
import { Text } from '../../../shared/ui';
import { BannerAd } from '../../../components/Ads/BannerAd';

export const PrayersScreen = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [prayers, setPrayers] = useState<Prayer[]>([]);
    const [filteredPrayers, setFilteredPrayers] = useState<Prayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<PrayerCategory | 'all' | 'favorites'>('all');

    useEffect(() => {
        loadPrayers();
    }, []);

    useEffect(() => {
        filterPrayers();
    }, [searchQuery, selectedCategory, prayers]);

    const loadPrayers = async () => {
        try {
            setLoading(true);
            const allPrayers = await databaseService.getAllPrayers();
            setPrayers(allPrayers);
        } catch (error) {
            console.error('Failed to load prayers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterPrayers = () => {
        let filtered = prayers;

        // Filter by category
        if (selectedCategory === 'favorites') {
            filtered = filtered.filter(p => p.is_favorite);
        } else if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                p =>
                    p.title_tr.toLowerCase().includes(query) ||
                    p.arabic_text.includes(searchQuery) ||
                    p.turkish_translation.toLowerCase().includes(query) ||
                    p.transliteration.toLowerCase().includes(query)
            );
        }

        setFilteredPrayers(filtered);
    };

    const handleToggleFavorite = async (id: string) => {
        try {
            await databaseService.togglePrayerFavorite(id);
            // Update local state
            setPrayers(prev =>
                prev.map(p => (p.id === id ? { ...p, is_favorite: !p.is_favorite } : p))
            );
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    const renderCategoryChip = (
        category: PrayerCategory | 'all' | 'favorites',
        label: string
    ) => {
        const isSelected = selectedCategory === category;
        return (
            <TouchableOpacity
                key={category}
                style={[
                    styles.categoryChip,
                    {
                        backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                        borderWidth: 1,
                    },
                ]}
                onPress={() => setSelectedCategory(category)}
            >
                <Text
                    variant="caption"
                    weight={isSelected ? 'bold' : 'regular'}
                    color={isSelected ? '#FFF' : theme.colors.text}
                    style={styles.categoryText}
                >
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
                <Text variant="h3" weight="bold" color={theme.colors.text}>
                    {t.prayers.title}
                </Text>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: theme.colors.text }]}
                    placeholder={t.prayers.search}
                    placeholderTextColor={theme.colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Category Filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContent}
            >
                {renderCategoryChip('all', t.prayers.allCategories)}
                {renderCategoryChip('favorites', t.prayers.favorites)}
                {(Object.keys(PRAYER_CATEGORIES) as PrayerCategory[]).map(cat =>
                    renderCategoryChip(cat, t.prayers.categories[cat])
                )}
            </ScrollView>

            {/* Prayers List */}
            <View style={{ flex: 1 }}>
                {filteredPrayers.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="book-outline" size={64} color={theme.colors.textSecondary} />
                        <Text variant="body" color={theme.colors.textSecondary} style={styles.emptyText}>
                            {selectedCategory === 'favorites' ? t.prayers.noFavorites : t.prayers.noResults}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredPrayers}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <PrayerCard prayer={item} onToggleFavorite={handleToggleFavorite} />
                        )}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>

            {/* Banner Ad */}
            <BannerAd />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    categoriesContainer: {
        flexGrow: 0,
        height: 60,
        marginBottom: 8,
    },
    categoriesContent: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    categoryChip: {
        paddingHorizontal: 16,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        lineHeight: 20,
    },
    listContent: {
        paddingBottom: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        marginTop: 16,
        textAlign: 'center',
    },
});
