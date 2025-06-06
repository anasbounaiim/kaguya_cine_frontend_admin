import { create } from 'zustand';

type AuthState = {
  profile: { firstName: string; lastName: string; email: string; role: string } | null;
  setProfile: (profile: { firstName: string; lastName: string; email: string; role: string }) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile })
}));
