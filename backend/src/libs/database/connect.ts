import { envs } from '@config/env.validate';
import { logger } from '@libs/logger';
import mongoose from 'mongoose';

export const dbConnect = async () => {
	try {
		const conn = await mongoose.connect(envs.MONGO_URI, {
			compressors: ['zstd'],
		});
		logger.info(`MongoDB Connected: ${conn.connection.host}`);

		mongoose.connection.on('error', (err) => {
			logger.error('MongoDB connection error:', err);
		});
	} catch (err) {
		logger.error('[dbConnect] Error while connecting database', err);
		process.exit(1);
	}
};
