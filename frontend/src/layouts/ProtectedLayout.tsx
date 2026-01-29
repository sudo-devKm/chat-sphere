import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { SocketProvider } from '@/providers/SocketProvider';
import { useAuthStore } from '@/store/auth.store';
import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router';

export const ProtectedLayout = () => {
	const { user, isLoading } = useAuthStore();

	if (isLoading) {
		return <FullScreenLoader />;
	}

	if (!user && !isLoading) {
		return <Navigate to='/login' replace />;
	}

	return (
		<Suspense fallback={<FullScreenLoader />}>
			<SocketProvider>
				<Outlet />
			</SocketProvider>
		</Suspense>
	);
};
