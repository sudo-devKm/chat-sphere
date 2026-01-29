import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';

import { s3Client, S3_BUCKET } from '@/config/s3.config';
import { sendResponse } from '@/utils/common.util';
import { HttpException } from '@/exceptions/http.exception';
import { Chat } from '@/models/chat.model';
import { envs } from '@/config/env.validate';

class FileController {
	constructor() {
		/** empty */
	}

	/**
	 * Generate presigned URL for uploading a file to S3
	 * File belongs to a CHAT (not a user)
	 */
	readonly getUploadUrl = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const { chatId, fileName, fileType, fileSize } = req.body;

			if (!chatId || !fileName || !fileType || !fileSize) {
				throw new HttpException({
					message: 'chatId, fileName, fileType and fileSize are required',
					status: StatusCodes.BAD_REQUEST,
				});
			}

			// 🔐 Verify user is part of the chat
			const chat = await Chat.findById(chatId);
			if (!chat || !chat.participants.includes(req.user._id)) {
				throw new HttpException({
					message: 'Access denied',
					status: StatusCodes.FORBIDDEN,
				});
			}

			// 🔐 File size validation
			const MAX_SIZE = 50 * 1024 * 1024; // 50MB
			if (fileSize > MAX_SIZE) {
				throw new HttpException({
					message: 'File size exceeds limit',
					status: StatusCodes.BAD_REQUEST,
				});
			}

			// 🔐 File type validation
			const allowedTypes = [
				'image/png',
				'image/jpeg',
				'image/webp',
				'application/pdf',
				'video/mp4',
			];

			if (!allowedTypes.includes(fileType)) {
				throw new HttpException({
					message: 'Unsupported file type',
					status: StatusCodes.BAD_REQUEST,
				});
			}

			// Generate S3 key (chat-scoped)
			const extension = fileName.split('.').pop();
			const key = `chat-uploads/${chatId}/${uuid()}.${extension}`;

			const command = new PutObjectCommand({
				Bucket: S3_BUCKET,
				Key: key,
				ContentType: fileType,
			});

			const uploadUrl = await getSignedUrl(s3Client, command, {
				expiresIn: 300, // 5 minutes
			});

			const fileUrl = `https://${S3_BUCKET}.s3.${envs.AWS_REGION}.amazonaws.com/${key}`;

			return sendResponse({
				res,
				status: StatusCodes.OK,
				data: {
					uploadUrl,
					fileUrl,
					key,
					fileName,
					fileType,
					chatId,
				},
				message: 'Presigned upload URL generated',
			});
		} catch (err) {
			return next(err);
		}
	};

	/**
	 * Generate presigned URL for downloading a file from S3
	 * Accessible to all chat participants
	 */
	readonly getDownloadUrl = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const { chatId, key } = req.query;

			if (!chatId || !key) {
				throw new HttpException({
					message: 'chatId and key are required',
					status: StatusCodes.BAD_REQUEST,
				});
			}

			// 🔐 Verify user is part of the chat
			const chat = await Chat.findById(chatId.toString());
			if (!chat || !chat.participants.includes(req.user._id)) {
				throw new HttpException({
					message: 'Access denied',
					status: StatusCodes.FORBIDDEN,
				});
			}

			// 🔐 Ensure key belongs to this chat
			const keyStr = key.toString();
			if (!keyStr.startsWith(`chat-uploads/${chatId}/`)) {
				throw new HttpException({
					message: 'Invalid file key',
					status: StatusCodes.FORBIDDEN,
				});
			}

			const command = new GetObjectCommand({
				Bucket: S3_BUCKET,
				Key: keyStr,
				ResponseContentDisposition: 'attachment',
			});

			const downloadUrl = await getSignedUrl(s3Client, command, {
				expiresIn: 300, // 5 minutes
			});

			return sendResponse({
				res,
				status: StatusCodes.OK,
				data: { downloadUrl },
				message: 'Presigned download URL generated',
			});
		} catch (err) {
			return next(err);
		}
	};
}

export default new FileController();
