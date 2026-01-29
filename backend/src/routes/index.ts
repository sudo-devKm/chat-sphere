import { AppRoute } from '@/types/common.types';
import AuthRoute from './auth/auth.route';
import CallRoute from './call/call.route';
import UsersRoute from './users/users.route';
import ChatRoutes from './chat/chat.route';
import { FilesRoute } from './files/files.route';
import { HealthRoute } from './health/health.routes';

export default [
	new HealthRoute(),
	new AuthRoute(),
	new CallRoute(),
	new UsersRoute(),
	new ChatRoutes(),
	new FilesRoute(),
] as AppRoute[];
