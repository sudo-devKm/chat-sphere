import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import type { LoginPayload } from '@/types/auth.types';
import { login as apiLogin, me } from '@/api/auth/auth.api';
import { toastSuccess, toastError } from '@/components/toaster/Toast';
import axios from 'axios';

export const useLogin = () => {
	const [error, setError] = useState<string | null>(null);
	const { setUser, setLoading } = useAuthStore();

	const login = async (loginPayload: LoginPayload) => {
		try {
			setLoading(true);
			setError(null);
			await apiLogin(loginPayload);
			const userResponse = await me();
			setUser(userResponse.data.data);
			toastSuccess('User logged in successfully');
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

	return { login, error };
};
