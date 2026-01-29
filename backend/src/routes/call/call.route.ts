import { AppRoute } from '@/types/common.types';
import { Router } from 'express';
import callController from './controllers/call.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

export default class CallRoute implements AppRoute {
	readonly router: Router = Router();
	readonly path?: string = '/call';

	constructor() {
		// set call routes
		this.setCallRoutes();
	}

	private readonly setCallRoutes = () => {
		this.router.use(authMiddleware);
		// get call history
		this.router.get(`${this.path}`, callController.getCallHistory);
		// get call stats
		this.router.get(`${this.path}/stats`, callController.getCallStats);
		// Get and delete route
		this.router
			.route(`${this.path}/:id`)
			.get(callController.getCallById)
			.delete(callController.deleteCall);
	};
}
