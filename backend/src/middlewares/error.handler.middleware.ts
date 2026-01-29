import { HttpException } from '@/exceptions/http.exception';
import { logger } from '@/libs/logger';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { REQUEST_ID_HEADER } from '@/constants/header.constants';
import { createErrorResponse } from '@/utils/common.util';

export const errorHandlerMiddleware = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const requestId = res.getHeader(REQUEST_ID_HEADER)!.toString();
	try {
		// log error.
		if (error instanceof HttpException) {
			logger.warn('[errorHandlerMiddleware] Error occurred', error);
			return res
				.status(error.status)
				.json(createErrorResponse(error, requestId));
		}
		logger.error('[errorHandlerMiddleware] Error occurred', error);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json(createErrorResponse(error, requestId));
	} catch (err) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json(createErrorResponse(err, requestId));
	}
};
