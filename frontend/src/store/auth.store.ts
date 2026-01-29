import type { UserResponse } from '@/types/auth.types';
import { create } from 'zustand';

interface AuthStore {
	user: UserResponse | null;
	isLoading: boolean;
	setUser: (user: UserResponse | null) => void;
	setLoading: (value: boolean) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	user: null,
	isLoading: false,
	setUser: (user) => set({ user }),
	setLoading: (value) => set({ isLoading: value }),
	logout: () => set({ user: null }),
}));
