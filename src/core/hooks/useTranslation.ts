import { useSettingsStore } from '../../store';
import { tr } from '../../locales/tr';
import { en } from '../../locales/en';

export const useTranslation = () => {
    const { settings } = useSettingsStore();

    return {
        t: settings.language === 'tr' ? tr : en,
        locale: settings.language,
    };
};
