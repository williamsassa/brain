import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { Specialty } from '@/types';

interface AuthStoreState {
  user: User | null;
  doctor: { id: string; specialty: Specialty; email: string } | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setDoctorProfile: (doctor: { id: string; specialty: Specialty; email: string }) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      user: null,
      doctor: null,
      loading: false,
      setUser: (user) => set({ user }),
      setDoctorProfile: (doctor) => set({ doctor }),
      setLoading: (loading) => set({ loading }),
      logout: () => set({ user: null, doctor: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);
