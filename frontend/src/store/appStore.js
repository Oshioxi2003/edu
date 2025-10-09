import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Loading states
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  // Modal states
  isSearchOpen: false,
  isVideoOpen: false,
  isMobileMenuOpen: false,
  
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  toggleVideo: () => set((state) => ({ isVideoOpen: !state.isVideoOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  
  closeAllModals: () => set({
    isSearchOpen: false,
    isVideoOpen: false,
    isMobileMenuOpen: false,
  }),

  // Audio player state (for persistence across pages)
  currentAudio: null,
  audioProgress: {},
  
  setCurrentAudio: (audioData) => set({ currentAudio: audioData }),
  
  updateAudioProgress: (unitId, progress) => set((state) => ({
    audioProgress: {
      ...state.audioProgress,
      [unitId]: progress,
    },
  })),
  
  getAudioProgress: (unitId) => (state) => state.audioProgress[unitId] || 0,
}));

