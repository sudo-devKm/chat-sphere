import { me } from '@/api/auth/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { useEffect, useRef, type ReactNode } from 'react';

export const AuthBootstrapProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { setUser, setLoading } = useAuthStore();
	const initialized = useRef(false);

	useEffect(() => {
		if (initialized.current) {
			return;
		}

		initialized.current = true;

		const bootstrap = async () => {
			try {
				setLoading(true);
				const user = await me();
				setUser(user.data.data);
			} catch {
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		bootstrap();
	}, [setUser, setLoading]);

	return <>{children}</>;
};
