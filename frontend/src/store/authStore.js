import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      setAuth: (user, accessToken, refreshToken) => set({ 
        user, 
        accessToken, 
        refreshToken,
        isAuthenticated: true 
      }),
      
      setUser: (user) => set({ user }),
      
      setAccessToken: (accessToken) => set({ accessToken }),
      
      getAccessToken: () => get().accessToken,
      
      getRefreshToken: () => get().refreshToken,
      
      logout: () => set({ 
        user: null, 
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false 
      }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

