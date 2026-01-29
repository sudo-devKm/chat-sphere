import { Server, Socket } from 'socket.io';
import { Call } from '@/models/call.model';
import { SocketEvent } from '@/constants/socket.events';
import {
	createSocketError,
	createSocketSuccess,
} from '@/utils/socket-response.util';
import { logger } from '@/libs/logger';
import { HttpException } from '@/exceptions/http.exception';
import redis from '@/libs/redis/redis.client';
import { IUser, User } from '@/models/user.model';

export class CallSocketService {
	constructor(private readonly io: Server) {}

	register(socket: Socket) {
		logger.info(
			`[CALL][REGISTER] socketId=${socket.id} userId=${socket.userId}`,
		);

		socket.on(SocketEvent.CALL_INITIATE, (d) => {
			logger.info(
				`[CALL][INITIATE] from=${socket.userId} to=${d?.receiverId} type=${d?.callType}`,
			);
			this.initiate(socket, d);
		});

		socket.on(SocketEvent.CALL_ANSWER, (d) => {
			logger.info(`[CALL][ANSWER] userId=${socket.userId} callId=${d?.callId}`);
			this.answer(socket, d);
		});

		socket.on(SocketEvent.CALL_END, (d) => {
			logger.warn(`[CALL][END] userId=${socket.userId} callId=${d?.callId}`);
			this.end(socket, d);
		});
	}

	// ----------------------------
	// CALL INITIATE
	// ----------------------------
	private async initiate(
		socket: Socket,
		data: { receiverId: string; callType: string },
	) {
		try {
			const { receiverId, callType } = data;
			const callerId = socket.userId!;

			const receiverSocketId = await redis.get(`online:${receiverId}`);
			if (!receiverSocketId) {
				socket.emit(
					SocketEvent.CALL_ERROR,
					createSocketError(new HttpException({ message: 'User is offline' })),
				);
				return;
			}

			const [caller, receiver] = await Promise.all([
				User.findById(callerId).select('username'),
				User.findById(receiverId).select('username'),
			]);

			if (!caller || !receiver) {
				socket.emit(
					SocketEvent.CALL_ERROR,
					createSocketError(
						new HttpException({ message: 'User is not found' }),
					),
				);
				return;
			}

			const call = await Call.create({
				caller: callerId,
				receiver: data.receiverId,
				callType: data.callType,
				status: 'ringing',
			});

			const callId = call._id.toString();
			const roomId = `call:${callId}`;

			socket.join(roomId);
			this.io.sockets.sockets.get?.(receiverSocketId)?.join?.(roomId);

			await redis.hset(`call:${callId}`, {
				callerId,
				receiverId,
				status: 'ringing',
			});
			await redis.sadd('active:calls', callId);

			logger.info(
				`[CALL][CREATED] callId=${callId} caller=${callerId} receiver=${data.receiverId}`,
			);

			this.io.sockets.sockets.get?.(receiverSocketId)?.emit?.(
				SocketEvent.CALL_INCOMING,
				createSocketSuccess({
					data: {
						callId,
						peerId: callerId,
						peerName: caller.username,
						callType,
						isIncoming: true,
					},
					message: 'Incoming call',
				}),
			);

			socket.emit(
				SocketEvent.CALL_INITIATED,
				createSocketSuccess({
					message: 'Call initiated',
					data: {
						callId,
						peerId: receiverId,
						peerName: receiver.username,
						callType,
						isIncoming: false,
					},
				}),
			);
		} catch (err) {
			logger.error(
				`[CALL][INITIATE_ERROR] from=${socket.userId} to=${data?.receiverId}`,
				err,
			);

			socket.emit(SocketEvent.CALL_ERROR, createSocketError(err));
		}
	}

	// ----------------------------
	// CALL ANSWER
	// ----------------------------
	private async answer(socket: Socket, data: { callId: string }) {
		try {
			const { callId } = data;

			const call = await Call.findById(callId)
				.populate('caller', 'username')
				.populate('receiver', 'username');

			if (!call) {
				socket.emit(
					SocketEvent.CALL_ERROR,
					createSocketError(new HttpException({ message: 'Call not found' })),
				);
				return;
			}

			logger.info(`[CALL][ANSWERING] callId=${callId} userId=${socket.userId}`);

			await Call.findByIdAndUpdate(callId, { status: 'active' });

			// 🔥 SEND ONLY TO CALLER
			this.io.to(`user:${call.caller._id.toString()}`).emit(
				SocketEvent.CALL_ANSWERED,
				createSocketSuccess({
					message: 'Call answered',
					data: {
						callId,
						status: 'active',
						callType: call.callType,
						answeredAt: call.startTime.toISOString(),
						caller: {
							id: call.caller._id.toString(),
							name: (call.caller as unknown as IUser).username,
						},
						receiver: {
							id: call.receiver._id.toString(),
							name: (call.receiver as unknown as IUser).username,
						},
					},
				}),
			);

			logger.info(`[CALL][ACTIVE] callId=${callId}`);
		} catch (err) {
			logger.error(
				`[CALL][ANSWER_ERROR] callId=${data?.callId} userId=${socket.userId}`,
				err,
			);

			socket.emit(SocketEvent.CALL_ERROR, createSocketError(err));
		}
	}

	// ----------------------------
	// CALL END
	// ----------------------------
	private async end(socket: Socket, data: { callId: string }) {
		try {
			const { callId } = data;
			logger.warn(
				`[CALL][ENDING] callId=${data.callId} userId=${socket.userId}`,
			);

			const call = await Call.findByIdAndUpdate(data.callId, {
				status: 'ended',
				endTime: new Date(),
			});

			if (!call) return;

			const roomId = `call:${callId}`;
			this.io.to(roomId).emit(
				SocketEvent.CALL_END,
				createSocketSuccess({
					message: 'Call ended',
				}),
			);

			this.io.in(roomId).socketsLeave(roomId);

			await redis.del(`call:${callId}`);
			await redis.srem('active:calls', callId);

			logger.info(`[CALL][ENDED] callId=${data.callId}`);
		} catch (err) {
			logger.error(
				`[CALL][END_ERROR] callId=${data?.callId} userId=${socket.userId}`,
				err,
			);

			socket.emit(SocketEvent.CALL_ERROR, createSocketError(err));
		}
	}
}
