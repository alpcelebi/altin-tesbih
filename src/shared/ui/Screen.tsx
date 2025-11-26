import React from 'react';
import { View, StyleSheet, ViewProps, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../core/hooks';
import Constants from 'expo-constants';

// Conditional AdMob import (only works in custom dev client or production)
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

const isCustomClient = Constants.appOwnership !== 'expo';
if (isCustomClient) {
    try {
        const googleMobileAds = require('react-native-google-mobile-ads');
        BannerAd = googleMobileAds.BannerAd;
        BannerAdSize = googleMobileAds.BannerAdSize;
        TestIds = googleMobileAds.TestIds;
    } catch (error) {
        if (__DEV__) {
            console.warn('Google Mobile Ads native module is missing. Banner ads will be hidden.');
        }
    }
} else if (__DEV__) {
    console.log('Google Mobile Ads skipped because the app runs inside Expo Go.');
}

interface ScreenProps extends ViewProps {
    safeArea?: boolean;
    centered?: boolean;
    padding?: boolean;
    withAd?: boolean;
}

// Use Test ID for development
const adUnitId = __DEV__ && TestIds ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy';

export const Screen: React.FC<ScreenProps> = ({
    children,
    safeArea = true,
    centered = false,
    padding = false,
    withAd = true,
    style,
    ...props
}) => {
    const theme = useTheme();
    const Container = safeArea ? SafeAreaView : View;

    return (
        <Container
            style={[
                styles.container,
                { backgroundColor: theme.colors.background },
                centered && styles.centered,
                style,
            ]}
            {...props}
        >
            <StatusBar
                barStyle={theme.colors.background === '#121212' ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />

            <View style={[
                styles.content,
                padding && { padding: theme.spacing.md },
                centered && styles.centered,
            ]}>
                {children}
            </View>

            {withAd && BannerAd && BannerAdSize && (
                <View style={[styles.adContainer, { backgroundColor: theme.colors.surface }]}>
                    <BannerAd
                        unitId={adUnitId}
                        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                        requestOptions={{
                            requestNonPersonalizedAdsOnly: true,
                        }}
                    />
                </View>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    adContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 4,
    },
});
