import { Router } from 'express';
import { AppRoute } from '@/types/common.types';
import authController from './controllers/auth.controller';
import { LogInSchema } from './validation/login.validation';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { RegisterSchema } from './validation/register.validation';
import { validateSchemaMiddleware } from '@/middlewares/validation.schema.middleware';

export default class AuthRoute implements AppRoute {
	readonly router = Router();
	readonly path = '/auth';

	constructor() {
		this.setAuthRoutes();
	}

	private readonly setAuthRoutes = () => {
		// register route
		this.router
			.route(`${this.path}/register`)
			.post(
				validateSchemaMiddleware({ body: { schema: RegisterSchema } }),
				authController.register,
			);
		// login route
		this.router
			.route(`${this.path}/login`)
			.post(
				validateSchemaMiddleware({ body: { schema: LogInSchema } }),
				authController.login,
			);
		// get current user data
		this.router
			.route(`${this.path}/me`)
			.get(authMiddleware, authController.getCurrentUser);
		// logout route
		this.router
			.route(`${this.path}/logout`)
			.post(authMiddleware, authController.logout);
	};
}
