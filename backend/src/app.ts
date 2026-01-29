import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import compression from 'compression';
import { logger } from '@/libs/logger';
import cookieParser from 'cookie-parser';
import IORedis, { Redis } from 'ioredis';
import { envs } from '@/config/env.validate';
import { AppRoute } from './types/common.types';
import express, { Application } from 'express';
import { createServer, Server } from 'node:http';
import { dbConnect } from '@libs/database/connect';
import redisClient from '@/libs/redis/redis.client';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { registerSockets } from '@/libs/sockets/index.sockets';
import { requestIdMiddleware } from '@middlewares/request-id.middleware';
import { errorHandlerMiddleware } from '@middlewares/error.handler.middleware';

export class App {
	private readonly app: Application;
	private readonly routes: AppRoute[] = [];
	private readonly port: number;
	private readonly httpServer: Server;
	private readonly io: SocketIOServer;
	private pubClient?: Redis;
	private subClient?: Redis;

	constructor(routes: AppRoute[]) {
		this.app = express();
		this.httpServer = createServer(this.app);
		this.port = envs.PORT;
		this.routes = routes;
		this.io = new SocketIOServer(this.httpServer, {
			cors: {
				origin: envs.FRONTEND_URL,
				methods: ['GET', 'POST'],
				credentials: true,
			},
			pingTimeout: 60000,
			pingInterval: 25000,
		});
	}

	readonly start = async () => {
		// set up redis and redis socket io adaptor
		await this.setupRedisAdapter();
		// connect database first.
		await dbConnect();
		// set standard middlewares.
		this.setStandardMiddlewares();
		// set routes
		this.setRoutes();
		// set socket server.
		this.setSocketServer();
		// set error handler middleware
		this.setErrorHandlerMiddleware();
		// start server.
		this.listen();
		// enable shut down hooks.
		this.setShutdownHooks();
	};

	private readonly setupRedisAdapter = async () => {
		// ensure redis is available (used by our data client)
		try {
			await redisClient.ping();
			logger.info('ioredis ping successful');
		} catch (err) {
			logger.warn('ioredis ping failed, continuing without blocking startup');
		}

		// Configure socket.io adapter using ioredis pub/sub clients.
		try {
			// Duplicate the existing app data client when possible. Duplicates share
			// the parent connection config and avoid creating extra simultaneous
			// initial connections which can lead to "already connecting/connected".
			if (redisClient && typeof redisClient.duplicate === 'function') {
				this.pubClient = redisClient.duplicate();
				this.subClient = redisClient.duplicate();
			} else {
				const redisUrl =
					envs.REDIS_URL && envs.REDIS_URL.length ? envs.REDIS_URL : undefined;
				this.pubClient = redisUrl
					? new IORedis(redisUrl)
					: new IORedis({
							host: envs.REDIS_HOST,
							port: Number(envs.REDIS_PORT),
						});
				this.subClient = this.pubClient.duplicate();
			}

			// ioredis starts connecting on construction/duplicate; do not call
			// `connect()` here to avoid concurrent connect errors.
			this.io.adapter(createAdapter(this.pubClient!, this.subClient!));
			logger.info('Socket.IO Redis adapter configured (ioredis duplicates)');
		} catch (err) {
			logger.warn('Socket.IO Redis adapter failed to configure (ioredis)', err);
		}
	};

	private readonly setStandardMiddlewares = () => {
		// set trust proxy
		this.app.enable('trust proxy');
		// set security headers
		this.app.use(
			helmet({
				contentSecurityPolicy: {
					directives: {
						defaultSrc: ["'self'"],
						connectSrc: [
							"'self'",
							process.env.FRONTEND_URL || 'http://localhost:4200',
						],
					},
				},
			}),
		);
		// set cors.
		this.app.use(
			cors({
				origin: process.env.FRONTEND_URL || 'http://localhost:4200',
				credentials: true,
			}),
		);
		// set json parser
		this.app.use(express.json());
		// set url parser.
		this.app.use(express.urlencoded({ extended: true }));
		// set cookie parser
		this.app.use(cookieParser());
		// set compression.
		this.app.use(compression());
		// set request logger.
		this.app.use(
			morgan('dev', { stream: { write: (message) => logger.http(message) } }),
		);
		// set Request id middleware.
		this.app.use(requestIdMiddleware);
	};

	private readonly setRoutes = () => {
		this.routes.forEach((route) => {
			this.app.use('/api', route.router);
		});
	};

	private readonly setSocketServer = () => {
		registerSockets(this.io);
	};

	private readonly setErrorHandlerMiddleware = () => {
		// set global error handler
		this.app.use(errorHandlerMiddleware);
	};

	private readonly cleanUp = async (error?: any) => {
		// close server.
		if (this.httpServer) {
			this.httpServer.close(() => {
				logger.info('Closing server gracefully!');
			});
		}

		if (mongoose?.connection) {
			await mongoose.connection.close();
			logger.info('MongoDB connection closed through app termination');
		}

		// disconnect node-redis pub/sub clients if adapter was used
		try {
			if (this.pubClient && typeof this.pubClient.disconnect === 'function') {
				this.pubClient.disconnect();
			}
			if (this.subClient && typeof this.subClient.disconnect === 'function') {
				this.subClient.disconnect();
			}
		} catch (err) {
			logger.warn('Error disconnecting socket adapter redis clients', err);
		}
	};

	private readonly setShutdownHooks = () => {
		process.on('SIGTERM', async () => {
			logger.info('SIGTERM event occurred');
			// clean up.
			await this.cleanUp();
			// exit process.
			process.exit(0);
		});

		process.on('SIGINT', async () => {
			logger.info('SIGINT event occurred');
			// clean up.
			await this.cleanUp();
			// exit process.
			process.exit(0);
		});
	};

	private readonly listen = () => {
		this.httpServer.listen(this.port, () => {
			logger.info('===================================');
			logger.info(`Server is running on ${this.port}`);
			logger.info('===================================');
		});
	};
}
