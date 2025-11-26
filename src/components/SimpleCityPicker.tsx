import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useTranslation } from '../core/hooks';
import { Text } from '../shared/ui';
import { City } from '../core/types';
import { TURKISH_STATES } from '../core/constants';
import { locationService } from '../services/locationService';

interface SimpleCityPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (city: City) => void;
    selectedCity?: City | null;
    title?: string;
}

export const SimpleCityPicker = ({
    visible,
    onClose,
    onSelect,
    selectedCity,
    title,
}: SimpleCityPickerProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        if (!visible) {
            setSearchQuery('');
        }
    }, [visible]);

    const filteredCities = useMemo(() => {
        if (!searchQuery) {
            return TURKISH_STATES;
        }

        const query = normalize(searchQuery);
        return TURKISH_STATES.filter((city: City) => normalize(city.name).includes(query));
    }, [searchQuery]);

    const handleCitySelect = (city: City) => {
        onSelect(city);
        setSearchQuery('');
        onClose();
    };

    const handleUseLocation = async () => {
        setIsLocating(true);
        try {
            const city = await locationService.getCurrentCity();
            if (city) {
                handleCitySelect(city);
            } else {
                alertLocationError();
            }
        } catch (error) {
            console.error('Failed to resolve city via location:', error);
            alertLocationError();
        } finally {
            setIsLocating(false);
        }
    };

    const alertLocationError = () => {
        Alert.alert(t.common.error, t.errors.locationUnavailable || t.errors.unknownError);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.header}>
                    <Text variant="h3" weight="bold">
                        {title || t.prayerTimes.selectCity}
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
                    <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.colors.text }]}
                        placeholder={t.prayerTimes.searchCity}
                        placeholderTextColor={theme.colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.locationButton, { borderColor: theme.colors.border }]}
                    onPress={handleUseLocation}
                    disabled={isLocating}
                >
                    {isLocating ? (
                        <ActivityIndicator color={theme.colors.primary} />
                    ) : (
                        <Ionicons name="locate" size={20} color={theme.colors.primary} />
                    )}
                    <Text variant="body" color={theme.colors.primary} weight="medium" style={{ marginLeft: 8 }}>
                        {t.prayerTimes.useCurrentLocation}
                    </Text>
                </TouchableOpacity>

                <FlatList
                    data={filteredCities}
                    keyExtractor={(item) => item.id}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.cityItem,
                                {
                                    borderBottomColor: theme.colors.border,
                                    backgroundColor:
                                        selectedCity?.id === item.id ? theme.colors.surface : 'transparent',
                                },
                            ]}
                            onPress={() => handleCitySelect(item)}
                        >
                            <Text variant="body">{item.name}</Text>
                            {selectedCity?.id === item.id && (
                                <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                            )}
                        </TouchableOpacity>
                    )}
                />
            </View>
        </Modal>
    );
};

const normalize = (value: string) =>
    value
        .toLocaleLowerCase('tr-TR')
        .trim()
        .replace(/ı/g, 'i')
        .replace(/ş/g, 's')
        .replace(/ğ/g, 'g')
        .replace(/ç/g, 'c')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    cityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
});
