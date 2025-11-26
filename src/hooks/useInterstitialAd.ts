import { useEffect, useState, useCallback } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

// Geliştirme aşamasında TestIds.INTERSTITIAL kullanıyoruz.
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3940256099942544/1033173712';

let interstitial: InterstitialAd | null = null;

export const useInterstitialAd = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Singleton instance mantığı ile reklamı sadece bir kez oluşturuyoruz
        if (!interstitial) {
            interstitial = InterstitialAd.createForAdRequest(adUnitId, {
                requestNonPersonalizedAdsOnly: true,
            });
        }

        const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            setLoaded(true);
        });

        const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            setLoaded(false);
            // Reklam kapandıktan sonra yenisini yükle
            interstitial?.load();
        });

        const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
            console.error('Interstitial Ad Error:', error);
            setLoaded(false);
        });

        // İlk yükleme
        interstitial.load();

        return () => {
            unsubscribeLoaded();
            unsubscribeClosed();
            unsubscribeError();
        };
    }, []);

    const showAd = useCallback(() => {
        if (interstitial && loaded) {
            interstitial.show();
        } else {
            console.log('Interstitial ad not ready yet');
        }
    }, [loaded]);

    return { showAd, isLoaded: loaded };
};
