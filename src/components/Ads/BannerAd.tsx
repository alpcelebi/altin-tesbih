import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd as AdMobBanner, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Geliştirme aşamasında TestIds.BANNER kullanıyoruz.
// Canlıya geçerken burayı gerçek Ad Unit ID ile değiştireceğiz.
const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-3940256099942544/6300978111'; // Fallback to test ID if not dev for safety in this context

export const BannerAd = () => {
    const [adFailed, setAdFailed] = useState(false);

    if (adFailed) {
        return null; // Reklam yüklenemezse boş döner, yer kaplamaz
    }

    return (
        <View style={styles.container}>
            <AdMobBanner
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
                onAdFailedToLoad={(error) => {
                    console.error('BannerAd failed to load: ', error);
                    setAdFailed(true);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 10,
    },
});
