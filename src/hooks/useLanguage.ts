import { useUIStore } from '@/store/uiStore';
import { t, TranslationKey } from '@/lib/translations';

export const useLanguage = () => {
  const { language, toggleLanguage, setLanguage } = useUIStore();

  const translate = (key: TranslationKey): string => {
    return t(key, language);
  };

  return {
    language,
    toggleLanguage,
    setLanguage,
    t: translate,
  };
};
