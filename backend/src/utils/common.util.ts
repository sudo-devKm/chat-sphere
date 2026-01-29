import { envs } from '@/config/env.validate';
import { REQUEST_ID_HEADER } from '@/constants/header.constants';
import { CommonResponseParams, SendResponseParams } from '@/types/common.types';
import { StatusCodes } from 'http-status-codes';
import Jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

export const sendResponse = (params: SendResponseParams) => {
	const { res, status = StatusCodes.OK, ...otherParams } = params ?? {};

	return res.status(status).json(
		createSuccessResponse({
			...otherParams,
			requestId: res.getHeader?.(REQUEST_ID_HEADER)?.toString()!,
		}),
	);
};

export const createErrorResponse = (error: any, requestId: string) => {
	return {
		status: error?.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
		message: error?.message ?? 'Something went wrong!',
		success: error?.success ?? false,
		requestId,
		...(error?.data && { data: error?.data }),
	};
};

export const createSuccessResponse = (
	params?: Omit<CommonResponseParams, 'status'> & { requestId: string },
) => {
	const {
		data = null,
		message = 'Success !',
		success = true,
		requestId,
	} = params ?? {};
	return {
		...(data && { data }),
		message,
		success,
		requestId,
	};
};

export const createJwtToken = (user: {
	_id: ObjectId | string;
	email: string;
}) => {
	return Jwt.sign(user, envs.JWT_SECRET, { expiresIn: '1d', issuer: 'trello' });
};

export const verifyJwtToken = (authToken: string) => {
	return Jwt.verify(authToken, envs.JWT_SECRET) as JwtPayload;
};
