import { AppRoute } from '@/types/common.types';
import { Router } from 'express';
import healthController from './controllers/health.controller';

export class HealthRoute implements AppRoute {
	readonly router = Router();
	readonly path?: string = '';

	constructor() {
		/** empty */
		this.setHealthRoutes();
	}

	private readonly setHealthRoutes = () => {
		// set check Health route.
		this.router.route(`/health`).get(healthController.getHealth);
	};
}
