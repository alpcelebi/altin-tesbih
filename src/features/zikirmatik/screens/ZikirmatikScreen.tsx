import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, RefreshControl, Alert, TextInput } from 'react-native';
import { Screen, Text, Button } from '../../../shared/ui';
import { useZikirStore } from '../../../store';
import { useTheme, useTranslation } from '../../../core/hooks';
import { databaseService } from '../../../core/database';
import { ZikirHistory } from '../../../core/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BannerAd } from '../../../components/Ads/BannerAd';
import { useInterstitialAd } from '../../../hooks/useInterstitialAd';

export const ZikirmatikScreen = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const {
        selectedZikir,
        loadZikirs,
        incrementCount,
        resetCount,
        saveToHistory,
        zikirs,
        selectZikir,
        updateTarget,
        createCustomZikir,
        deleteZikir
    } = useZikirStore();

    const [showList, setShowList] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [todayHistory, setTodayHistory] = useState<ZikirHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingTarget, setEditingTarget] = useState(false);
    const [targetInput, setTargetInput] = useState('');

    // Add Zikir State
    const [newZikirName, setNewZikirName] = useState('');
    const [newZikirTarget, setNewZikirTarget] = useState('33');

    // Ads
    const { showAd, isLoaded } = useInterstitialAd();

    useEffect(() => {
        loadZikirs();
        loadTodayHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedZikir) {
            setTargetInput(selectedZikir.target.toString());
        }
    }, [selectedZikir]);

    const loadTodayHistory = async () => {
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const history = await databaseService.getZikirHistoryByDate(today, today);
            setTodayHistory(history);
        } catch (error) {
            console.error('Error loading today history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToHistory = async () => {
        await saveToHistory();
        await loadTodayHistory();

        if (isLoaded) {
            showAd();
        }
    };

    const handleDeleteHistory = async (id: string) => {
        Alert.alert(
            t.common.delete || 'Sil',
            t.zikirmatik.deleteHistoryConfirm || 'Bu kaydı silmek istediğinize emin misiniz?',
            [
                { text: t.common.cancel, style: 'cancel' },
                {
                    text: t.common.delete || 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await databaseService.deleteZikirHistory(id);
                            await loadTodayHistory();
                        } catch (error) {
                            console.error('Error deleting history:', error);
                            Alert.alert(t.common.error, t.errors.unknownError);
                        }
                    },
                },
            ]
        );
    };

    const handleTargetChange = async () => {
        const newTarget = parseInt(targetInput, 10);
        if (!isNaN(newTarget) && newTarget > 0 && selectedZikir) {
            await updateTarget(newTarget);
            setEditingTarget(false);
        } else {
            Alert.alert(t.common.error, 'Geçerli bir sayı girin');
            setTargetInput(selectedZikir?.target.toString() || '33');
        }
    };

    const handleAddZikir = async () => {
        if (!newZikirName.trim()) {
            Alert.alert(t.common.error, 'Lütfen zikir adı girin');
            return;
        }

        const target = parseInt(newZikirTarget, 10);
        if (isNaN(target) || target <= 0) {
            Alert.alert(t.common.error, 'Geçerli bir hedef sayısı girin');
            return;
        }

        try {
            await createCustomZikir(newZikirName, undefined, target);
            setShowAddModal(false);
            setNewZikirName('');
            setNewZikirTarget('33');
            Alert.alert(t.common.success, 'Yeni zikir eklendi');
        } catch (error) {
            Alert.alert(t.common.error, 'Zikir eklenirken bir hata oluştu');
        }
    };

    const handleDeleteZikir = async (id: string) => {
        Alert.alert(
            t.common.delete,
            'Bu zikiri silmek istediğinize emin misiniz?',
            [
                { text: t.common.cancel, style: 'cancel' },
                {
                    text: t.common.delete,
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteZikir(id);
                        } catch (error) {
                            Alert.alert(t.common.error, 'Zikir silinemedi');
                        }
                    }
                }
            ]
        );
    };

    if (!selectedZikir) {
        return (
            <Screen centered>
                <Text>{t.common.loading}</Text>
            </Screen>
        );
    }

    const progress = selectedZikir.target > 0
        ? Math.min(selectedZikir.count / selectedZikir.target, 1)
        : 0;

    return (
        <Screen safeArea style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.zikirSelector, { backgroundColor: theme.colors.surface }]}
                    onPress={() => setShowList(true)}
                >
                    <View>
                        <Text variant="h3" weight="bold" color={theme.colors.primary}>
                            {selectedZikir.name}
                        </Text>
                        {selectedZikir.arabicText && (
                            <Text variant="body" color={theme.colors.textSecondary} style={styles.arabicText}>
                                {selectedZikir.arabicText}
                            </Text>
                        )}
                    </View>
                    <Ionicons name="chevron-down" size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Main Counter */}
            <View style={styles.counterContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={incrementCount}
                    style={styles.touchableArea}
                >
                    <View style={styles.progressContainer}>
                        {/* Top Line */}
                        <View style={[styles.progressLine, { backgroundColor: theme.colors.border }]} />

                        {/* Progress Fill */}
                        <View style={styles.progressFillContainer}>
                            <LinearGradient
                                colors={[theme.colors.primary, theme.colors.primary + '80']}
                                style={[styles.progressFill, { width: `${progress * 100}%` }]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                        </View>

                        {/* Bottom Line */}
                        <View style={[styles.progressLine, { backgroundColor: theme.colors.border }]} />

                        {/* Counter Number */}
                        <View style={styles.counterContent}>
                            <Text variant="h1" style={{ fontSize: 48 }} weight="bold">
                                {selectedZikir.count}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Target Input */}
                <View style={styles.targetContainer}>
                    <Text variant="body" color={theme.colors.textSecondary} style={styles.targetLabel}>
                        {t.zikirmatik.target}:
                    </Text>
                    {editingTarget ? (
                        <View style={styles.targetInputContainer}>
                            <TextInput
                                style={[styles.targetInput, {
                                    color: theme.colors.text,
                                    borderColor: theme.colors.primary,
                                    backgroundColor: theme.colors.surface
                                }]}
                                value={targetInput}
                                onChangeText={setTargetInput}
                                keyboardType="numeric"
                                autoFocus
                                onBlur={handleTargetChange}
                                onSubmitEditing={handleTargetChange}
                            />
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => setEditingTarget(true)}
                            style={styles.targetButton}
                        >
                            <Text variant="body" weight="bold" color={theme.colors.primary}>
                                {selectedZikir.target}
                            </Text>
                            <Ionicons name="pencil" size={16} color={theme.colors.primary} style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                <Button
                    title={t.zikirmatik.reset}
                    onPress={resetCount}
                    variant="secondary"
                    icon={<Ionicons name="refresh" size={16} color={theme.colors.text} />}
                    style={styles.controlButton}
                />
                <Button
                    title={t.zikirmatik.saveToHistory}
                    onPress={handleSaveToHistory}
                    variant="primary"
                    icon={<Ionicons name="save-outline" size={16} color="#FFF" />}
                    style={styles.controlButton}
                />
            </View>

            {/* Today's History */}
            <View style={styles.historySection}>
                <View style={styles.historyHeader}>
                    <Text variant="h4" weight="bold">
                        {t.zikirmatik.history || 'Kayıtlar'}
                    </Text>
                    <TouchableOpacity onPress={loadTodayHistory}>
                        <Ionicons name="refresh" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    style={styles.historyList}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={loadTodayHistory} />
                    }
                >
                    {todayHistory.length > 0 ? (
                        todayHistory.map((item) => (
                            <View
                                key={item.id}
                                style={[styles.historyItem, { backgroundColor: theme.colors.surface }]}
                            >
                                <View style={styles.historyLeft}>
                                    <View style={[styles.historyIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                                        <Ionicons name="finger-print" size={16} color={theme.colors.primary} />
                                    </View>
                                    <View style={styles.historyInfo}>
                                        <Text variant="body" weight="medium">{item.zikirName}</Text>
                                        <Text variant="caption" color={theme.colors.textSecondary}>
                                            {new Date(item.timestamp).toLocaleTimeString('tr-TR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.historyRight}>
                                    <Text variant="h4" weight="bold" color={theme.colors.primary} style={styles.historyCount}>
                                        +{item.count}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => handleDeleteHistory(item.id)}
                                        style={[styles.deleteButton, { backgroundColor: theme.colors.error + '20' }]}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Ionicons name="trash-outline" size={18} color={theme.colors.error || '#FF3B30'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyHistory}>
                            <Text variant="body" color={theme.colors.textSecondary}>
                                {t.zikirmatik.noHistoryToday || 'Bugün henüz kayıt yok'}
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>

            {/* Zikir List Modal */}
            <Modal
                visible={showList}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowList(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                    <View style={styles.modalHeader}>
                        <Text variant="h3" weight="bold">{t.zikirmatik.selectZikir}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowList(false);
                                    setShowAddModal(true);
                                }}
                                style={{ padding: 4 }}
                            >
                                <Ionicons name="add-circle" size={28} color={theme.colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowList(false)}>
                                <Ionicons name="close" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView style={styles.listContainer}>
                        {zikirs.map((zikir) => (
                            <TouchableOpacity
                                key={zikir.id}
                                style={[
                                    styles.listItem,
                                    {
                                        backgroundColor: theme.colors.surface,
                                        borderColor: selectedZikir.id === zikir.id ? theme.colors.primary : 'transparent',
                                        borderWidth: 1,
                                    }
                                ]}
                                onPress={() => {
                                    selectZikir(zikir);
                                    setShowList(false);
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text variant="body" weight="bold">{zikir.name}</Text>
                                    {zikir.arabicText && (
                                        <Text variant="caption" color={theme.colors.textSecondary}>
                                            {zikir.arabicText}
                                        </Text>
                                    )}
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    {selectedZikir.id === zikir.id && (
                                        <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                                    )}
                                    {zikir.isCustom && (
                                        <TouchableOpacity
                                            onPress={() => handleDeleteZikir(zikir.id)}
                                            style={{ padding: 4 }}
                                        >
                                            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Modal>

            {/* Add Zikir Modal */}
            <Modal
                visible={showAddModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: theme.colors.surface, borderRadius: 16, padding: 20 }}>
                        <Text variant="h3" weight="bold" style={{ marginBottom: 20 }}>Yeni Zikir Ekle</Text>

                        <Text variant="body" style={{ marginBottom: 8 }}>Zikir Adı</Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                borderRadius: 8,
                                padding: 12,
                                marginBottom: 16,
                                color: theme.colors.text,
                                fontSize: 16
                            }}
                            placeholder="Örn: Sübhanallah"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={newZikirName}
                            onChangeText={setNewZikirName}
                        />

                        <Text variant="body" style={{ marginBottom: 8 }}>Hedef Sayısı</Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                borderRadius: 8,
                                padding: 12,
                                marginBottom: 24,
                                color: theme.colors.text,
                                fontSize: 16
                            }}
                            placeholder="33"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={newZikirTarget}
                            onChangeText={setNewZikirTarget}
                            keyboardType="numeric"
                        />

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <Button
                                title={t.common.cancel}
                                onPress={() => setShowAddModal(false)}
                                variant="secondary"
                                style={{ flex: 1 }}
                            />
                            <Button
                                title={t.common.add}
                                onPress={handleAddZikir}
                                variant="primary"
                                style={{ flex: 1 }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Banner Ad */}
            <BannerAd />
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 40,
    },
    zikirSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    arabicText: {
        marginTop: 4,
        fontFamily: 'System', // Use a font that supports Arabic if available
    },
    counterContainer: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchableArea: {
        width: '100%',
        alignItems: 'center',
    },
    progressContainer: {
        width: '100%',
        maxWidth: 300,
        position: 'relative',
        paddingVertical: 40,
    },
    progressLine: {
        height: 4,
        width: '100%',
        borderRadius: 2,
    },
    progressFillContainer: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    counterContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    targetContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        gap: 8,
    },
    targetLabel: {
        marginRight: 4,
    },
    targetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    targetInputContainer: {
        minWidth: 80,
    },
    targetInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: 80,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20,
        gap: 12,
    },
    controlButton: {
        flex: 1,
        paddingVertical: 10,
        minHeight: 44,
    },
    modalContainer: {
        flex: 1,
        marginTop: 60,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    listContainer: {
        flex: 1,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    historySection: {
        marginTop: 20,
        maxHeight: 200,
        flex: 1, // Allow history to take remaining space but share with banner
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    historyList: {
        maxHeight: 180,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    historyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    historyInfo: {
        flex: 1,
    },
    historyRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    historyCount: {
        marginRight: 4,
    },
    historyIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
    },
    emptyHistory: {
        padding: 16,
        alignItems: 'center',
    },
});
