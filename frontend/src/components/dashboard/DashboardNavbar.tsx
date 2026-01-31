import { AppBar, Toolbar, Button, Avatar, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';

import { disconnectSocket } from '@/socket/socket';
import { logout } from '@/api/auth/auth.api';
import { AppLogo } from '../common/AppLogo';
import { useAuthStore } from '@/store/auth.store';
import { toastSuccess } from '../toaster/Toast';

export const DashboardNavbar = () => {
	const { setUser, user } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			toastSuccess('Signed out successfully');
			setUser(null);
		} catch {
			setUser(null);
		}
		disconnectSocket();
		navigate('/login', { replace: true });
	};

	return (
		<AppBar
			position='sticky'
			elevation={0}
			sx={{
				backgroundColor: 'background.paper',
				borderBottom: '1px solid',
				borderColor: 'divider',
			}}
		>
			<Toolbar
				disableGutters
				sx={{
					px: 2,
					display: 'flex',
					justifyContent: 'space-between',
					minHeight: 64,
				}}
			>
				{/* Left: Logo and Home */}
				<Stack direction='row' spacing={2} alignItems='center'>
					<AppLogo />
				</Stack>

				{/* Right: User and Logout */}
				<Stack direction='row' spacing={2} alignItems='center'>
					<Avatar
						sx={{
							width: 36,
							height: 36,
							bgcolor: 'primary.main',
							fontSize: '0.875rem',
							fontWeight: 600,
						}}
					>
						{user?.username?.[0]?.toUpperCase() || 'U'}
					</Avatar>
					<Button
						variant='outlined'
						startIcon={<LogOut size={18} />}
						onClick={handleLogout}
						sx={{
							textTransform: 'none',
							borderRadius: 2,
							borderColor: 'error.main',
							color: 'error.main',
							'&:hover': {
								borderColor: 'error.dark',
								backgroundColor: 'error.50',
							},
						}}
					>
						Sign Out
					</Button>
				</Stack>
			</Toolbar>
		</AppBar>
	);
};
