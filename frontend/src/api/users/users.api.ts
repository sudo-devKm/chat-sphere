import { http } from '@/api/http';
import type { UserResponse } from '@/types/auth.types';
import { API_ENDPOINTS } from '../endpoints';

export const getUsers = (page: number) => {
	return http.get<{
		users: UserResponse[];
		success: boolean;
		pagination: { page: number; limit: number; total: number };
	}>(API_ENDPOINTS.USERS.GET_USERS, {
		params: { page, limit: 60 },
	});
};
