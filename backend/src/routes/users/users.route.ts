import express, { Router } from 'express';
import {
	getAllUsers,
	getUserById,
	updateProfile,
	deleteUser,
	searchUsers,
} from './controllers/user.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { AppRoute } from '@/types/common.types';

export default class UsersRoute implements AppRoute {
	readonly router = Router();
	readonly path = '/users';

	constructor() {
		this.setUsersRoute();
	}

	private readonly setUsersRoute = () => {
		this.router.use(authMiddleware);
		this.router.get(`${this.path}`, getAllUsers);
		this.router.get(`${this.path}/search`, searchUsers);
		this.router.get(`${this.path}/:id`, getUserById);
		this.router.put(`${this.path}/profile`, updateProfile);
		this.router.delete(`${this.path}/:id`, deleteUser);
	};
}
