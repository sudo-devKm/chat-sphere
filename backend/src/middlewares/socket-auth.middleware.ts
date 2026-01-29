import { Socket } from 'socket.io';
import { parse as parseCookie } from 'cookie';
import { verifyJwtToken } from '@/utils/common.util';
import { AUTH_COOKIE_HEADER } from '@/constants/header.constants';
import { logger } from '@/libs/logger';

export const socketAuthMiddleware = async (
	socket: Socket,
	next: (err?: Error) => void,
) => {
	try {
		const cookieHeader = socket.handshake.headers.cookie;
		if (!cookieHeader) {
			return next(new Error('Authentication failed'));
		}

		const cookies = parseCookie(cookieHeader);
		const token = cookies[AUTH_COOKIE_HEADER];

		if (!token) {
			return next(new Error('Authentication failed'));
		}

		const decoded = verifyJwtToken(token);
		socket.userId = decoded._id as string;

		next();
	} catch (err) {
		logger.error('Socket auth error', err);
		next(new Error('Authentication failed'));
	}
};
