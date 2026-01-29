import { IUser } from '@/models/user.model';

export {};

declare global {
	namespace Express {
		interface Request {
			requestId: string;
			user: IUser;
		}
	}
}

declare module 'socket.io' {
	interface Socket {
		userId?: string;
	}
}
