import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../../store';
import { lightTheme, darkTheme } from '../../theme';
import { Theme } from '../types';

export const useTheme = (): Theme => {
    const systemColorScheme = useColorScheme();
    const { settings } = useSettingsStore();

    if (settings.theme === 'auto') {
        return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }

    return settings.theme === 'dark' ? darkTheme : lightTheme;
};
