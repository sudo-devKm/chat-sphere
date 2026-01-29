import { cleanEnv, num, str } from 'envalid';
import 'dotenv/config';

export const envs = cleanEnv(process.env, {
	NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
	PORT: num(),
	MONGO_URI: str(),
	JWT_SECRET: str(),
	REDIS_URL: str({ default: '' }),
	REDIS_HOST: str({ default: '127.0.0.1' }),
	REDIS_PORT: num({ default: 6379 }),
	FRONTEND_URL: str(),
	AWS_REGION: str(),
	AWS_ACCESS_KEY_ID: str(),
	AWS_SECRET_ACCESS_KEY: str(),
	AWS_S3_BUCKET: str(),
});
