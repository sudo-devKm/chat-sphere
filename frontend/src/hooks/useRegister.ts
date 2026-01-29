import { useState } from 'react';
import { register as apiRegister, me } from '@/api/auth/auth.api';
import { useAuthStore } from '@/store/auth.store';
import type { RegisterPayload } from '@/types/auth.types';
import { toastSuccess, toastError } from '@/utils/toast';

export const useRegister = () => {
	const [error, setError] = useState<string | null>(null);
	const { setUser, setLoading } = useAuthStore();

	const register = async (registerPayload: RegisterPayload) => {
		try {
			setLoading(true);
			await apiRegister(registerPayload);
			const userResponse = await me();
			setUser(userResponse?.data?.data);
			toastSuccess('User registered successfully');
			return true;
		} catch (err: any) {
			setError(err?.message);
			toastError(err?.message);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { register, error };
};
