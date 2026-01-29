import {
	createErrorResponse,
	createSuccessResponse,
} from '@/utils/common.util';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class HealthController {
	constructor() {
		/** empty */
	}

	readonly getHealth = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			return res
				.status(StatusCodes.OK)
				.json(createSuccessResponse({ requestId: req.requestId }));
		} catch (err) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json(createErrorResponse(err, req.requestId));
		}
	};
}

export default new HealthController();
