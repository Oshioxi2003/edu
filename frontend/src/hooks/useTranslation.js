import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/translations';

export function useTranslation() {
  const { language } = useLanguageStore();
  
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value || key;
  };

  // Helper for array translations
  const tArray = (key) => {
    const value = t(key);
    return Array.isArray(value) ? value : [];
  };

  return { t, tArray, language };
}


