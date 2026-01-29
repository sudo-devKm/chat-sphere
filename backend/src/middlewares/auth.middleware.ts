import { AUTH_COOKIE_HEADER } from '@/constants/header.constants';
import { HttpException } from '@/exceptions/http.exception';
import { User } from '@/models/user.model';
import { verifyJwtToken } from '@/utils/common.util';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const UNAUTHORIZED_MESSAGE = 'Unauthorized access';

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authToken = req.cookies[AUTH_COOKIE_HEADER];

		if (!authToken) {
			throw new HttpException({
				message: UNAUTHORIZED_MESSAGE,
				status: StatusCodes.UNAUTHORIZED,
			});
		}

		const userData = verifyJwtToken(authToken);

		if (!userData?._id) {
			throw new HttpException({
				message: UNAUTHORIZED_MESSAGE,
				status: StatusCodes.UNAUTHORIZED,
			});
		}

		const currentUser = await User.findById(userData._id);

		if (!currentUser) {
			throw new HttpException({
				message: UNAUTHORIZED_MESSAGE,
				status: StatusCodes.UNAUTHORIZED,
			});
		}

		req.user = currentUser.toJSON();
		return next();
	} catch (err) {
		return next(err);
	}
};
