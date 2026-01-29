import { useAuthStore } from '@/store/auth.store';
import { Navigate, Outlet } from 'react-router';

export const PublicLayout: React.FC = () => {
	const { user, isLoading } = useAuthStore();

	if (isLoading) {
		return null;
	}

	if (user) {
		return <Navigate to='/dashboard' replace />;
	}

	return <Outlet />;
};
