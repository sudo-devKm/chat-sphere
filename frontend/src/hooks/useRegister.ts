import { useState } from 'react';
import { register as apiRegister, me } from '@/api/auth/auth.api';
import { useAuthStore } from '@/store/auth.store';
import type { RegisterPayload } from '@/types/auth.types';
import { toastSuccess, toastError } from '@/components/toaster/Toast';
import axios from 'axios';

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
			const errorMessage =
				(axios.isAxiosError(err)
					? err?.response?.data.message
					: err?.message) ?? 'Something Went wrong!';
			setError(errorMessage);
			toastError(errorMessage);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { register, error };
};
