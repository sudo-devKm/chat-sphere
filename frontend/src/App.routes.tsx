import { HomePage } from '@/pages/home/HomePage';
import { createBrowserRouter } from 'react-router';
import { RegisterPage } from '@/pages/register/RegisterPage';
import { NotFoundPage } from './pages/not-found/NoteFound';
import { LoginPage } from './pages/login/LoginPage';
import { PublicLayout } from '@/layouts/PublicLayout';
import { ProtectedLayout } from '@/layouts/ProtectedLayout';
import { DashboardPage } from './pages/dashboard/DashboardPage';

export const router = createBrowserRouter([
	{
		Component: PublicLayout,
		children: [
			{ path: '/', Component: HomePage },
			{ path: '/register', Component: RegisterPage },
			{ path: '/login', Component: LoginPage },
		],
	},
	{
		Component: ProtectedLayout,
		children: [{ path: '/dashboard', Component: DashboardPage }],
	},
	{ path: '*', Component: NotFoundPage },
]);
