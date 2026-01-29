import { REQUEST_ID_HEADER } from '@/constants/header.constants';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

export const requestIdMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const requestId =
			(req.headers[REQUEST_ID_HEADER] ?? '').toString() || uuid();
		req.headers[REQUEST_ID_HEADER] = requestId;
		res.setHeader(REQUEST_ID_HEADER, requestId);
		req.requestId = requestId;
		return next();
	} catch (err) {
		return next(err);
	}
};
