import { getSocket } from '@/socket/socket';
import {
	createContext,
	useContext,
	useEffect,
	useRef,
	type ReactNode,
} from 'react';

type SocketType = ReturnType<typeof getSocket>;

const SocketContext = createContext<SocketType | null>(null);

export const useSocket = (): SocketType => {
	const socket = useContext(SocketContext);
	if (!socket) {
		throw new Error('useSocket must be used inside SocketProvider');
	}
	return socket;
};

export const SocketProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const socketRef = useRef<SocketType | null>(null);

	if (!socketRef.current) {
		socketRef.current = getSocket();
	}

	useEffect(() => {
		const socket = socketRef.current!;
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
	}, []);

	return (
		<SocketContext.Provider value={socketRef.current}>
			{children}
		</SocketContext.Provider>
	);
};
