import { authMiddleware } from '@/middlewares/auth.middleware';
import { AppRoute } from '@/types/common.types';
import { Router } from 'express';
import fileController from './controllers/file.controller';

export class FilesRoute implements AppRoute {
	readonly router = Router();
	readonly path = '/files';

	constructor() {
		this.setFilesRoutes();
	}

	private readonly setFilesRoutes = () => {
		// upload file using presigned url
		this.router
			.route(`${this.path}/presigned-upload`)
			.post(authMiddleware, fileController.getUploadUrl);
		// download file using presigned url
		this.router
			.route(`${this.path}/presigned-download`)
			.get(authMiddleware, fileController.getDownloadUrl);
	};
}
