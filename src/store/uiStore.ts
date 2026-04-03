import { create } from 'zustand';

interface UIStoreState {
  language: 'en' | 'fr';
  sidebarOpen: boolean;
  theme: 'light' | 'dark';

  toggleLanguage: () => void;
  setLanguage: (lang: 'en' | 'fr') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  language: 'en',
  sidebarOpen: true,
  theme: 'dark',

  toggleLanguage: () => set((state) => ({
    language: state.language === 'en' ? 'fr' : 'en',
  })),
  setLanguage: (lang) => set({ language: lang }),
  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen,
  })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
}));
