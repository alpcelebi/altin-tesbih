import React from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Linking } from 'react-native';
import { Screen, Text } from '../../../shared/ui';
import { useSettingsStore } from '../../../store';
import { useTheme, useTranslation } from '../../../core/hooks';
import { Ionicons } from '@expo/vector-icons';
import { storageService } from '../../../core/services';

export const SettingsScreen = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const {
        settings,
        toggleTheme,
        toggleLanguage,
        toggleSound,
        toggleHaptic,
        toggleNotifications
    } = useSettingsStore();

    const handleClearData = () => {
        Alert.alert(
            t.settings.clearData,
            t.settings.clearDataConfirm,
            [
                { text: t.common.cancel, style: 'cancel' },
                {
                    text: t.common.delete,
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await storageService.clearAll();
                            Alert.alert(t.common.success, 'Application data cleared. Please restart the app.');
                        } catch (error) {
                            Alert.alert(t.common.error, t.errors.unknownError);
                        }
                    }
                }
            ]
        );
    };

    const SettingItem = ({
        title,
        subtitle,
        icon,
        value,
        onToggle,
        type = 'switch',
        onPress
    }: {
        title: string;
        subtitle?: string;
        icon: any;
        value?: boolean | string;
        onToggle?: (value: boolean) => void;
        type?: 'switch' | 'button' | 'info';
        onPress?: () => void;
    }) => (
        <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
            onPress={type === 'switch' ? () => onToggle && onToggle(!Boolean(value)) : onPress}
            disabled={type === 'info'}
        >
            <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.background }]}>
                    <Ionicons name={icon} size={22} color={theme.colors.text} />
                </View>
                <View>
                    <Text variant="body" weight="medium">{title}</Text>
                    {subtitle && (
                        <Text variant="caption" color={theme.colors.textSecondary}>{subtitle}</Text>
                    )}
                </View>
            </View>

            {type === 'switch' && typeof value === 'boolean' && (
                <Switch
                    value={value}
                    onValueChange={onToggle}
                    trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                    thumbColor={'#FFF'}
                />
            )}

            {type === 'button' && (
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            )}

            {type === 'info' && (
                <Text variant="caption" color={theme.colors.textSecondary}>{String(value)}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <Screen safeArea style={styles.container}>
            <View style={styles.header}>
                <Text variant="h1" weight="bold">{t.settings.title}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Appearance */}
                <Text variant="h4" weight="bold" style={styles.sectionTitle} color={theme.colors.primary}>
                    {t.settings.appearance}
                </Text>
                <View style={styles.section}>
                    <SettingItem
                        title={t.settings.theme}
                        subtitle={settings.theme === 'dark' ? t.settings.themeDark : t.settings.themeLight}
                        icon={settings.theme === 'dark' ? 'moon' : 'sunny'}
                        type="button"
                        onPress={toggleTheme}
                    />
                    <SettingItem
                        title={t.settings.language}
                        subtitle={settings.language === 'tr' ? t.settings.languageTurkish : t.settings.languageEnglish}
                        icon="language"
                        type="button"
                        onPress={toggleLanguage}
                    />
                </View>

                {/* Feedback */}
                <Text variant="h4" weight="bold" style={styles.sectionTitle} color={theme.colors.primary}>
                    {t.settings.feedback}
                </Text>
                <View style={styles.section}>
                    <SettingItem
                        title={t.settings.sound}
                        icon="musical-note"
                        value={settings.soundEnabled}
                        onToggle={toggleSound}
                    />
                    <SettingItem
                        title={t.settings.haptic}
                        icon="phone-portrait"
                        value={settings.hapticEnabled}
                        onToggle={toggleHaptic}
                    />
                    <SettingItem
                        title={t.settings.notifications}
                        icon="notifications"
                        value={settings.notificationsEnabled}
                        onToggle={toggleNotifications}
                    />
                </View>

                {/* Data */}
                <Text variant="h4" weight="bold" style={styles.sectionTitle} color={theme.colors.primary}>
                    {t.settings.data}
                </Text>
                <View style={styles.section}>
                    <SettingItem
                        title={t.settings.clearData}
                        icon="trash"
                        type="button"
                        onPress={handleClearData}
                    />
                </View>
 
                {/* About */}
                <Text variant="h4" weight="bold" style={styles.sectionTitle} color={theme.colors.primary}>
                    {t.settings.about}
                </Text>
                <View style={[styles.section, { marginBottom: 40 }]}>
                    <SettingItem
                        title={t.settings.version}
                        icon="information-circle"
                        type="info"
                        value="1.0.0"
                    />
                    <SettingItem
                        title={t.settings.privacyPolicy}
                        icon="shield-checkmark"
                        type="button"
                        onPress={() => {
                            const url = 'https://alpcelebi.github.io/altin-tesbih-privacy/index.html';
                            Linking.openURL(url).catch(() => {
                                Alert.alert(t.common.error, 'Could not open privacy policy');
                            });
                        }}
                    />
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
    sectionTitle: {
        marginBottom: 12,
        marginLeft: 4,
    },
    section: {
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
