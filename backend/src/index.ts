import { App } from './app';
import Routes from '@/routes';
import { logger } from '@/libs/logger';

const bootstrap = async () => {
	const application = new App(Routes);
	// start application
	await application.start();
};

bootstrap().catch(() => {
	logger.error('Error occurred while starting server');
});
