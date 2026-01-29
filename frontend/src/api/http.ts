import { envs } from '@/config/env';
import axios from 'axios';

export const http = axios.create({
	baseURL: envs.VITE_API_URL,
	withCredentials: true,
});
