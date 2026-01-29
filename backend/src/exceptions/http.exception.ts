import { HttpExceptionPrams } from '@/types/common.types';
import { StatusCodes } from 'http-status-codes';

export class HttpException extends Error {
	readonly message: string;
	readonly status: number;
	readonly data: Record<string, any> | null;
	readonly success: boolean;

	constructor(params?: HttpExceptionPrams) {
		const {
			message = 'Something went wrong',
			status = StatusCodes.INTERNAL_SERVER_ERROR,
			success = false,
			data = null,
		} = params ?? {};
		super(message);

		// set prototype
		Object.setPrototypeOf(this, HttpException.prototype);

		this.message = message;
		this.status = status;
		this.data = data;
		this.success = success;

		// capture stack trace
		Error.captureStackTrace(this, this.constructor);
	}
}
