import * as Location from 'expo-location';
import { City } from '../core/types';
import { TURKISH_STATES } from '../core/constants';

class LocationService {
    /**
     * Request foreground location permission from the user
     */
    async requestPermission(): Promise<boolean> {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    }

    /**
     * Try to resolve the user's current city based on GPS coordinates.
     * Returns null if permission is denied or the lookup fails.
     */
    async getCurrentCity(): Promise<City | null> {
        const hasPermission = await this.requestPermission();
        if (!hasPermission) {
            return null;
        }

        try {
            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced
            });
            const placemarks = await Location.reverseGeocodeAsync(position.coords);

            if (!placemarks.length) {
                return null;
            }

            const { city, district, region, subregion } = placemarks[0];
            const possibleNames = [city, district, subregion, region].filter(Boolean) as string[];

            for (const name of possibleNames) {
                const matchedCity = this.findCityByName(name);
                if (matchedCity) {
                    return matchedCity;
                }
            }

            return null;
        } catch (error) {
            console.error('Location service error:', error);
            return null;
        }
    }

    private findCityByName(name: string): City | null {
        const normalized = this.normalize(name);

        return (
            TURKISH_STATES.find(
                (city) => this.normalize(city.name) === normalized || this.normalize(city.stateName) === normalized
            ) || null
        );
    }

    private normalize(value: string): string {
        const normalized = value
            .toLocaleLowerCase('tr-TR')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        // Handle Turkish specific characters that are not normalized via NFD
        return normalized
            .replace(/ı/g, 'i')
            .replace(/ş/g, 's')
            .replace(/ğ/g, 'g')
            .replace(/ç/g, 'c')
            .replace(/ö/g, 'o')
            .replace(/ü/g, 'u');
    }
}

export const locationService = new LocationService();
