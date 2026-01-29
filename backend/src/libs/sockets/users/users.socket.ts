import { Server, Socket } from 'socket.io';
import redisClient from '@/libs/redis/redis.client';
import { User } from '@/models/user.model';
import { SocketEvent } from '@/constants/socket.events';
import {
	createSocketError,
	createSocketSuccess,
} from '@/utils/socket-response.util';
import { logger } from '@/libs/logger';

export class UsersSocketService {
	constructor(private readonly io: Server) {}

	register(socket: Socket) {
		logger.info(
			`[SOCKET][CONNECT] socketId=${socket.id} userId=${socket.userId}`,
		);

		this.handleConnect(socket);

		socket.on(SocketEvent.USERS_SYNC, () => {
			logger.debug(`[SOCKET][USERS_SYNC] userId=${socket.userId}`);
			this.handleUsersSync(socket);
		});

		socket.on(SocketEvent.USER_STATUS, (d) => {
			logger.info(
				`[SOCKET][USER_STATUS] userId=${socket.userId} status=${d?.status}`,
			);
			this.handleStatusChange(socket, d);
		});

		socket.on('disconnect', (reason) => {
			logger.warn(
				`[SOCKET][DISCONNECT] userId=${socket.userId} socketId=${socket.id} reason=${reason}`,
			);
			this.handleDisconnect(socket);
		});
	}

	// ----------------------------
	// CONNECT
	// ----------------------------
	private async handleConnect(socket: Socket) {
		const userId = socket.userId!;
		try {
			logger.info(`[PRESENCE][ONLINE] userId=${userId}`);

			await redisClient.set(`online:${userId}`, socket.id);
			await redisClient.sadd('online:users', userId);

			await User.findByIdAndUpdate(userId, {
				status: 'online',
				socketId: socket.id,
				lastSeen: new Date(),
			});

			socket.join(`user:${userId}`);
			logger.info(`[SOCKET] user:${userId} joined`);

			await this.broadcastOnlineUsers();
		} catch (err) {
			logger.error(`[PRESENCE][ONLINE_ERROR] userId=${userId}`, err);
			socket.emit(SocketEvent.USERS_ONLINE, createSocketError(err));
		}
	}

	// ----------------------------
	// SYNC ONLINE USERS
	// ----------------------------
	private async handleUsersSync(socket: Socket) {
		try {
			logger.debug(`[PRESENCE][SYNC] userId=${socket.userId}`);

			const users = await redisClient.smembers('online:users');

			socket.emit(
				SocketEvent.USERS_ONLINE,
				createSocketSuccess({
					data: { users },
					message: 'Online users synced',
				}),
			);
		} catch (err) {
			logger.error(`[PRESENCE][SYNC_ERROR] userId=${socket.userId}`, err);
			socket.emit(SocketEvent.USERS_ONLINE, createSocketError(err));
		}
	}

	// ----------------------------
	// STATUS CHANGE
	// ----------------------------
	private async handleStatusChange(
		socket: Socket,
		data: { status: 'online' | 'away' | 'busy' },
	) {
		try {
			logger.info(
				`[PRESENCE][STATUS_CHANGE] userId=${socket.userId} newStatus=${data.status}`,
			);

			await User.findByIdAndUpdate(socket.userId, {
				status: data.status,
				lastSeen: new Date(),
			});

			await this.broadcastOnlineUsers();
		} catch (err) {
			logger.error(`[PRESENCE][STATUS_ERROR] userId=${socket.userId}`, err);
			socket.emit(SocketEvent.USER_STATUS, createSocketError(err));
		}
	}

	// ----------------------------
	// DISCONNECT
	// ----------------------------
	private async handleDisconnect(socket: Socket) {
		const userId = socket.userId!;
		try {
			logger.warn(`[PRESENCE][OFFLINE] userId=${userId}`);

			await redisClient.del(`online:${userId}`);
			await redisClient.srem('online:users', userId);

			await User.findByIdAndUpdate(userId, {
				status: 'offline',
				socketId: null,
				lastSeen: new Date(),
			});

			await this.broadcastOnlineUsers();
		} catch (err) {
			logger.error(`[PRESENCE][OFFLINE_ERROR] userId=${userId}`, err);
		}
	}

	// ----------------------------
	// BROADCAST ONLINE USERS
	// ----------------------------
	private async broadcastOnlineUsers() {
		try {
			const users = await redisClient.smembers('online:users');

			logger.debug(`[PRESENCE][BROADCAST] onlineCount=${users.length}`);

			this.io.emit(
				SocketEvent.USERS_ONLINE,
				createSocketSuccess({
					data: { users },
					message: 'Online users updated',
				}),
			);
		} catch (err) {
			logger.error('[PRESENCE][BROADCAST_ERROR]', err);
		}
	}
}
