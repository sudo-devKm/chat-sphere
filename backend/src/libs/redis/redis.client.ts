import IORedis from 'ioredis';
import { envs } from '@/config/env.validate';
import { logger } from '../logger';

const redis = new IORedis(envs.REDIS_URL);

redis.on('connect', () => {
	logger.info('Redis client connected');
});

redis.on('error', (err) => {
	logger.error('Redis error', err);
});

export default redis;
