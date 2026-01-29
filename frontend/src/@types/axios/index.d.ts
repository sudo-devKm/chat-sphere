import axios, { AxiosRequestConfig, AxiosError } from 'axios';

// Extend Axios types
declare module 'axios' {
	export interface AxiosRequestConfig {
		skipAuthRedirect?: boolean;
		showErrorToast?: boolean;
		retryAttempts?: number;
	}
}
