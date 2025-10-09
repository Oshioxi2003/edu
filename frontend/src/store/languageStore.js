import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLanguageStore = create(
  persist(
    (set) => ({
      language: 'vi', // Default language
      
      setLanguage: (language) => set({ language }),
      
      toggleLanguage: () => set((state) => ({
        language: state.language === 'vi' ? 'en' : 'vi',
      })),
    }),
    {
      name: 'language-storage',
    }
  )
);


