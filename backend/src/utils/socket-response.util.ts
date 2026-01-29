import { StatusCodes } from 'http-status-codes';

export interface SocketSuccessResponse<T = any> {
	success: true;
	message: string;
	data?: T;
	requestId?: string;
}

export interface SocketErrorResponse {
	success: false;
	message: string;
	status: number;
	requestId?: string;
	data?: any;
}

/**
 * SUCCESS
 */
export const createSocketSuccess = <T>(
	params: {
		data?: T;
		message?: string;
		requestId?: string;
	} = {},
): SocketSuccessResponse<T> => {
	return {
		success: true,
		message: params.message ?? 'Success !',
		...(params.data && { data: params.data }),
		...(params.requestId && { requestId: params.requestId }),
	};
};

/**
 * ERROR
 */
export const createSocketError = (
	error: any,
	requestId?: string,
): SocketErrorResponse => {
	return {
		success: false,
		status: error?.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
		message: error?.message ?? 'Something went wrong!',
		...(error?.data && { data: error.data }),
		...(requestId && { requestId }),
	};
};
