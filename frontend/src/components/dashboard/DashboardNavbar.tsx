import { AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { disconnectSocket } from '@/socket/socket';
import { logout } from '@/api/auth/auth.api';
import { AppLogo } from '../common/AppLogo';
import { useAuthStore } from '@/store/auth.store';
import { toastSuccess } from '@/utils/toast';

export const DashboardNavbar = () => {
	const { setUser } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			toastSuccess('User logged out successfully');
			setUser(null);
		} catch {
			setUser(null);
		}
		disconnectSocket();
		navigate('/login', { replace: true });
	};

	return (
		<AppBar position='sticky' elevation={1}>
			<Toolbar
				disableGutters
				sx={{
					px: 2,
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				{/* 🔥 APP LOGO */}
				<AppLogo />

				{/* LOGOUT */}
				<Button color='inherit' onClick={handleLogout}>
					Logout
				</Button>
			</Toolbar>
		</AppBar>
	);
};
