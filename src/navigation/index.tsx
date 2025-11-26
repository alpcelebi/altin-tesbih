import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useTranslation } from '../core/hooks';
import { ZikirmatikScreen } from '../features/zikirmatik/screens/ZikirmatikScreen';
import { PrayersScreen } from '../features/prayers/screens/PrayersScreen';
import { StatisticsScreen } from '../features/statistics/screens/StatisticsScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';

const Tab = createMaterialTopTabNavigator();

export const AppNavigator = () => {
    const theme = useTheme();
    const { t } = useTranslation();

    return (
        <NavigationContainer>
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
                <Tab.Navigator
                    screenOptions={{
                        tabBarStyle: {
                            backgroundColor: theme.colors.surface,
                            borderBottomColor: theme.colors.border,
                            borderBottomWidth: 1,
                            elevation: 4,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            paddingTop: 8,
                        },
                        tabBarActiveTintColor: theme.colors.primary,
                        tabBarInactiveTintColor: theme.colors.textSecondary,
                        tabBarLabelStyle: {
                            fontSize: 12,
                            fontWeight: '600',
                            textTransform: 'none',
                        },
                        tabBarIndicatorStyle: {
                            backgroundColor: theme.colors.primary,
                            height: 3,
                        },
                        tabBarItemStyle: {
                            paddingVertical: 8,
                        },
                    }}
                >
                    <Tab.Screen
                        name="Zikirmatik"
                        component={ZikirmatikScreen}
                        options={{
                            title: t.tabs.zikirmatik,
                        }}
                    />
                    <Tab.Screen
                        name="Prayers"
                        component={PrayersScreen}
                        options={{
                            title: t.tabs.prayers,
                        }}
                    />
                    <Tab.Screen
                        name="Statistics"
                        component={StatisticsScreen}
                        options={{
                            title: t.tabs.statistics,
                        }}
                    />
                    <Tab.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{
                            title: t.tabs.settings,
                        }}
                    />
                </Tab.Navigator>
            </SafeAreaView>
        </NavigationContainer>
    );
};
