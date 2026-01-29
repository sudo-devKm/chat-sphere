import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Message } from '@/models/message.model';
import { sendResponse } from '@/utils/common.util';
import { getOrCreateChat } from '../services/chat.service';

class ChatController {
	/**
	 * Get paginated messages between logged-in user and another user
	 */
	readonly getMessages = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const { chatId } = req.query;
			const page = Math.max(Number(req.query.page) || 1, 1);
			const limit = Math.min(Number(req.query.limit) || 20, 50);
			const skip = (page - 1) * limit;

			const [messages, total] = await Promise.all([
				Message.find({ chatId: chatId!.toString() })
					.sort({ createdAt: -1 }) // latest first
					.skip(skip)
					.limit(limit)
					.lean(),
				Message.countDocuments({ chatId: chatId!.toString() }),
			]);

			return sendResponse({
				res,
				status: StatusCodes.OK,
				data: {
					messages,
					pagination: {
						page,
						limit,
						total,
						totalPages: Math.ceil(total / limit),
						hasNextPage: skip + messages.length < total,
					},
				},
				message: 'Messages fetched successfully',
			});
		} catch (err) {
			return next(err);
		}
	};

	readonly getChatWithUser = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const currentUserId = req.user._id.toString()!; // from auth middleware
			const { userId } = req.params;

			if (!userId) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					success: false,
					message: 'userId is required',
				});
			}

			const chat = await getOrCreateChat(currentUserId, userId!.toString());

			return sendResponse({
				res,
				status: StatusCodes.OK,
				data: {
					chatId: chat._id,
				},
				message: 'Chat session ready',
			});
		} catch (err) {
			return next(err);
		}
	};
}

export default new ChatController();
