import { Server } from 'socket.io';
import { ChatSocketService } from './chat/chat.sockets';
import { CallSocketService } from './call/call.sockets';
import { WebRTCSocketService } from './webrtc/webrtc.sockets';
import { socketAuthMiddleware } from '@/middlewares/socket-auth.middleware';
import { UsersSocketService } from './users/users.socket';

export function registerSockets(io: Server) {
	io.use(socketAuthMiddleware);

	const usersService = new UsersSocketService(io);
	const chatService = new ChatSocketService(io);
	const callService = new CallSocketService(io);
	const webrtcService = new WebRTCSocketService(io);

	io.on('connection', (socket) => {
		usersService.register(socket);
		chatService.register(socket);
		callService.register(socket);
		webrtcService.register(socket);
	});
}
