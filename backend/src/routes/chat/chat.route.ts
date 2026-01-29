import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { AppRoute } from '@/types/common.types';
import chatController from './controllers/chat.controller';
import { validateSchemaMiddleware } from '@/middlewares/validation.schema.middleware';
import { GetMessagesParamsSchema } from './validation/chat.validation';

export default class ChatRoutes implements AppRoute {
	readonly router: Router = Router();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.route('/chats/messages').get(
			authMiddleware,
			validateSchemaMiddleware({
				query: { schema: GetMessagesParamsSchema },
			}),
			chatController.getMessages,
		);

		this.router
			.route('/chats/with-user/:userId')
			.get(authMiddleware, chatController.getChatWithUser);
	}
}
