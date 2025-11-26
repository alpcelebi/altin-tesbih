import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Prayer } from '../../../core/types';
import { useTheme, useTranslation } from '../../../core/hooks';

interface PrayerCardProps {
    prayer: Prayer;
    onToggleFavorite: (id: string) => void;
}

export const PrayerCard: React.FC<PrayerCardProps> = ({ prayer, onToggleFavorite }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => setIsExpanded(!isExpanded)}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {t.locale === 'en' && prayer.title_en ? prayer.title_en : prayer.title_tr}
                    </Text>
                    {prayer.source_detail && (
                        <Text style={[styles.source, { color: theme.colors.textSecondary }]}>
                            {prayer.source_detail}
                        </Text>
                    )}
                </View>
                <TouchableOpacity
                    onPress={() => onToggleFavorite(prayer.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name={prayer.is_favorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={prayer.is_favorite ? '#FF6B6B' : theme.colors.textSecondary}
                    />
                </TouchableOpacity>
            </View>

            {/* Arabic Text - Always visible */}
            <View style={styles.arabicContainer}>
                <Text style={[styles.arabicText, { color: theme.colors.text }]}>
                    {prayer.arabic_text}
                </Text>
            </View>

            {/* Expanded Content */}
            {isExpanded && (
                <View style={styles.expandedContent}>
                    {/* Transliteration */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                            {t.prayers.labels.transliteration}:
                        </Text>
                        <Text style={[styles.transliteration, { color: theme.colors.text }]}>
                            {prayer.transliteration}
                        </Text>
                    </View>

                    {/* Translation - Turkish or English based on language */}
                    {t.locale === 'en' && prayer.english_translation ? (
                        <View style={styles.section}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                                {t.prayers.labels.english || 'English'}:
                            </Text>
                            <Text style={[styles.translation, { color: theme.colors.text }]}>
                                {prayer.english_translation}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.section}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                                {t.prayers.labels.turkish}:
                            </Text>
                            <Text style={[styles.translation, { color: theme.colors.text }]}>
                                {prayer.turkish_translation}
                            </Text>
                        </View>
                    )}
                </View>
            )}

            {/* Expand Indicator */}
            <View style={styles.expandIndicator}>
                <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.colors.textSecondary}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    titleContainer: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    source: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    arabicContainer: {
        marginVertical: 12,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    arabicText: {
        fontSize: 22,
        lineHeight: 36,
        textAlign: 'right',
        fontWeight: '500',
    },
    expandedContent: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    section: {
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    transliteration: {
        fontSize: 14,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    translation: {
        fontSize: 15,
        lineHeight: 24,
    },
    expandIndicator: {
        alignItems: 'center',
        marginTop: 8,
    },
});
