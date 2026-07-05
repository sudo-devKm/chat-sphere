import { useEffect, useState, type ReactNode } from 'react';
import { getSocket } from '@/socket/socket';
import { SocketContext, type SocketType } from './SocketContext';

export const SocketProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [socket] = useState<SocketType>(() => getSocket());

	useEffect(() => {
		// ---- CONNECT ----
		socket.connect();

		// ---- CORE EVENTS ----
		const onConnect = () => {
			console.info('[SOCKET] Connected', socket.id);
		};

		const onDisconnect = (reason: string) => {
			console.warn('[SOCKET] Disconnected', reason);
		};

		const onConnectError = (err: Error) => {
			console.error('[SOCKET] Connection error', err.message);
		};

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('connect_error', onConnectError);

		// ---- CLEANUP ----
		return () => {
			socket?.off?.('connect', onConnect);
			socket?.off?.('disconnect', onDisconnect);
			socket?.off?.('connect_error', onConnectError);
		};
	}, [socket]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};
