import { create } from 'zustand';

type AuthState = {
  token: string | null;
  setToken: (token: string) => void;
  profile: { firstName: string; lastName: string; email: string; role: string } | null;
  setProfile: (profile: { firstName: string; lastName: string; email: string; role: string }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  profile: null,
  setProfile: (profile) => set({ profile }),
  logout: () => set({ token: null }),
}));
