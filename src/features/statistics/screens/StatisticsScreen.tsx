import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Screen, Text } from '../../../shared/ui';
import { useTheme, useTranslation } from '../../../core/hooks';
import { databaseService } from '../../../core/database';
import { ZikirHistory } from '../../../core/types';
import { Ionicons } from '@expo/vector-icons';

export const StatisticsScreen = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [history, setHistory] = useState<ZikirHistory[]>([]);
    const [stats, setStats] = useState({
        today: 0,
        total: 0,
    });
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const historyData = await databaseService.getZikirHistory(20);
            const totalCount = await databaseService.getTotalZikirCount();
            const today = new Date().toISOString().split('T')[0];
            const todayCount = await databaseService.getDailyZikirCount(today);

            setHistory(historyData);
            setStats({
                today: todayCount,
                total: totalCount,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: any; color: string }) => (
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View>
                <Text variant="caption" color={theme.colors.textSecondary}>{title}</Text>
                <Text variant="h2" weight="bold">{value.toLocaleString()}</Text>
            </View>
        </View>
    );

    return (
        <Screen safeArea style={styles.container}>
            <View style={styles.header}>
                <Text variant="h1" weight="bold">{t.statistics.title}</Text>
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={loadData} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Summary Cards */}
                <View style={styles.statsGrid}>
                    <StatCard
                        title={t.statistics.today}
                        value={stats.today}
                        icon="today"
                        color={theme.colors.primary}
                    />
                    <StatCard
                        title={t.statistics.total}
                        value={stats.total}
                        icon="stats-chart"
                        color={theme.colors.secondary}
                    />
                </View>

                {/* History List */}
                <View style={styles.section}>
                    <Text variant="h3" weight="bold" style={styles.sectionTitle}>
                        {t.statistics.history}
                    </Text>

                    {history.length > 0 ? (
                        history.map((item) => (
                            <View
                                key={item.id}
                                style={[styles.historyItem, { backgroundColor: theme.colors.surface }]}
                            >
                                <View style={styles.historyLeft}>
                                    <View style={[styles.historyIcon, { backgroundColor: theme.colors.primary + '10' }]}>
                                        <Ionicons name="finger-print" size={20} color={theme.colors.primary} />
                                    </View>
                                    <View>
                                        <Text variant="body" weight="medium">{item.zikirName}</Text>
                                        <Text variant="caption" color={theme.colors.textSecondary}>
                                            {new Date(item.timestamp).toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                                <Text variant="h4" weight="bold" color={theme.colors.primary}>
                                    +{item.count}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text color={theme.colors.textSecondary}>{t.statistics.noData}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    historyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    historyIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
    },
});
