import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd as AdMobBanner, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// TEST MODU: Her zaman test reklamları kullanıyoruz
const adUnitId = TestIds.BANNER;

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
