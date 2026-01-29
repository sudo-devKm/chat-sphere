import { envs } from '@/config/env.validate';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { printf, colorize, errors, timestamp, json, combine } = winston.format;

const devFormat = printf(({ level, message, timestamp, ...meta }) => {
	return `${timestamp} [${level}] ${message} ${
		Object.keys(meta)?.length > 0 ? JSON.stringify(meta, null, 2) : ''
	}`;
});

const dailyRotateFile = (level: string) => {
	return new DailyRotateFile({
		level,
		datePattern: 'YYYY-MM-DD',
		filename: `logs/${level}/%DATE%.log`,
		auditFile: `logs/${level}/${level}-audit.json`,
		maxFiles: '14d',
		maxSize: '20m',
	});
};

const createWinstonLogger = () => {
	return winston.createLogger({
		level: envs.isDevelopment ? 'debug' : 'info',
		format: combine(
			timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			errors({ stack: true }),
			envs.isDevelopment ? devFormat : json()
		),
		transports: [
			...(envs.isDevelopment
				? [
						new winston.transports.Console({
							format: combine(
								timestamp({ format: 'HH:mm:ss' }),
								colorize(),
								devFormat
							),
						}),
				  ]
				: []),
			...(envs.isProduction
				? [dailyRotateFile('info'), dailyRotateFile('error')]
				: []),
		],
	});
};

export const logger = createWinstonLogger();
