import { envs } from '@/config/env';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null;

export const getSocket = () => {
	if (!socket) {
		socket = io(envs.VITE_SOCKET_URL, {
			withCredentials: true,
			autoConnect: false,
			transports: ['websocket'],
		});
	}
	return socket;
};

export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};
