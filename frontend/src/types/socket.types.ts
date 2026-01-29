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
