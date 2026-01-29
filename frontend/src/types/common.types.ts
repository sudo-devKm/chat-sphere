export type ApiResponse<T = any> = {
	message: string;
	requestId: string;
	success: boolean;
	data: T;
};
