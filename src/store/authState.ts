import { User } from 'firebase/auth';
import { create } from 'zustand';

interface AuthState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));
