import { getSocket } from '@/socket/socket';
import { createContext, useContext } from 'react';

export type SocketType = ReturnType<typeof getSocket>;

export const SocketContext = createContext<SocketType | null>(null);

export const useSocket = (): SocketType => {
	const socket = useContext(SocketContext);
	if (!socket) {
		throw new Error('useSocket must be used inside SocketProvider');
	}
	return socket;
};
