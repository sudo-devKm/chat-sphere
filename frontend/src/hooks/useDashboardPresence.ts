import { useSocket } from '@/providers/SocketProvider';
import type { SocketSuccessResponse } from '@/types/socket.types';
import { useEffect, useRef } from 'react';

export const useDashboardPresence = (onOnlineIds: (ids: string[]) => void) => {
	const socket = useSocket();
	const initialized = useRef(false);
	useEffect(() => {
		if (initialized.current) {
			return;
		}
		initialized.current = true;
		socket.on(
			'users:online',
			({ data }: SocketSuccessResponse<{ users: string[] }>) => {
				onOnlineIds(data?.users!);
			},
		);
		socket.emit('users:sync');
		return () => {
			initialized.current = false;
			socket.off('users:online');
		};
	}, []);
};
