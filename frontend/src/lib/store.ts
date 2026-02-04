import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: string;
  verified: boolean;
}

interface Store {
  user: User | null;
  theme: { primary: string; secondary: string };
  setUser: (user: User | null) => void;
  setTheme: (theme: { primary: string; secondary: string }) => void;
  logout: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      theme: { primary: '#2563eb', secondary: '#1e40af' },
      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
      logout: () => {
        localStorage.clear();
        set({ user: null });
      },
    }),
    { name: 'buildbridge-storage' }
  )
);
