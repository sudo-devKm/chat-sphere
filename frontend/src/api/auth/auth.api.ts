import { http } from '@/api/http';
import type {
	LoginPayload,
	RegisterPayload,
	UserResponse,
} from '@/types/auth.types';
import type { ApiResponse } from '@/types/common.types';
import { API_ENDPOINTS } from '../endpoints';

export const login = (payload: LoginPayload) =>
	http.post<ApiResponse<UserResponse>>(API_ENDPOINTS.AUTH.LOGIN, payload);
export const register = (payload: RegisterPayload) =>
	http.post<ApiResponse<UserResponse>>(API_ENDPOINTS.AUTH.REGISTER, payload);
export const me = (options?: { skipAuthRedirection?: boolean }) =>
	http.get<ApiResponse<UserResponse>>(API_ENDPOINTS.AUTH.ME, {
		skipAuthRedirect: options?.skipAuthRedirection,
	});
export const logout = () =>
	http.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.LOGOUT);
