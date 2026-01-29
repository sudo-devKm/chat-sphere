import { Server, Socket } from 'socket.io';
import redisClient from '@/libs/redis/redis.client';
import { SocketEvent } from '@/constants/socket.events';
import {
	createSocketError,
	createSocketSuccess,
} from '@/utils/socket-response.util';
import { Message } from '@/models/message.model';
import { logger } from '@/libs/logger';
import { getOrCreateChat } from '@/routes/chat/services/chat.service';
import { Chat } from '@/models/chat.model';

type Attachment = {
	key: string;
	fileUrl: string;
	fileName: string;
	fileType: 'image' | 'file';
	mimeType: string;
	size: number;
	dimensions?: {
		width: number;
		height: number;
	};
};

type ChatSendPayload = {
	receiverId: string;
	content?: string;
	attachment?: Attachment;
};

export class ChatSocketService {
	constructor(private readonly io: Server) {}

	register(socket: Socket) {
		logger.info(
			`[CHAT][REGISTER] socketId=${socket.id} userId=${socket.userId}`,
		);

		socket.on(SocketEvent.CHAT_SEND, (d: ChatSendPayload) => {
			logger.debug(
				`[CHAT][SEND_REQUEST] from=${socket.userId} to=${d?.receiverId}`,
			);
			this.handleSendMessage(socket, d);
		});
	}

	private async handleSendMessage(socket: Socket, data: ChatSendPayload) {
		const senderId = socket.userId!;

		try {
			// Validate payload
			if (!data.content && !data.attachment) {
				throw new Error('Message content or attachment is required');
			}

			// Validate image dimensions if present
			if (data.attachment?.fileType === 'image' && data.attachment.dimensions) {
				const { width, height } = data.attachment.dimensions;
				if (width <= 0 || height <= 0) {
					throw new Error('Invalid image dimensions');
				}
			}

			// GET OR CREATE CHAT
			const chat = await getOrCreateChat(senderId, data.receiverId);

			// Persist message with dimensions
			const newMessage = new Message({
				chatId: chat._id,
				senderId,
				receiverId: data.receiverId,
				content: data.content ?? '',
				attachment: data.attachment ?? null,
				status: 'sent',
			});

			// Save message
			const message = await newMessage.save();

			// Update chat last message
			await Chat.findByIdAndUpdate(chat._id, {
				lastMessage: message._id,
			});

			logger.info(
				`[CHAT][PERSISTED] messageId=${message._id} from=${senderId} dimensions=${
					data.attachment?.dimensions
						? `${data.attachment.dimensions.width}x${data.attachment.dimensions.height}`
						: 'none'
				}`,
			);

			// Deliver to receiver if online
			const receiverSocketId = await redisClient.get(
				`online:${data.receiverId}`,
			);

			if (receiverSocketId) {
				this.io.to(receiverSocketId).emit(
					SocketEvent.CHAT_RECEIVE,
					createSocketSuccess({
						data: message,
						message: 'New message received',
					}),
				);

				logger.info(
					`[CHAT][DELIVERED] messageId=${message._id} to=${data.receiverId}`,
				);
			} else {
				logger.warn(
					`[CHAT][OFFLINE] receiverId=${data.receiverId} messageId=${message._id}`,
				);
			}

			// Ack to sender
			socket.emit(
				SocketEvent.CHAT_SUCCESS,
				createSocketSuccess({
					data: message,
					message: 'Message sent successfully',
				}),
			);

			logger.debug(`[CHAT][ACK] messageId=${message._id} sender=${senderId}`);
		} catch (err) {
			logger.error(
				`[CHAT][ERROR] from=${senderId} to=${data?.receiverId}`,
				err,
			);

			socket.emit(SocketEvent.CHAT_ERROR, createSocketError(err));
		}
	}
}
