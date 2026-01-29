import type React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { AppLogo } from '../components/common/AppLogo';

type AuthLayoutProps = {
	title: string;
	children: React.ReactNode;
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
	return (
		<Container maxWidth='sm'>
			<Box
				sx={{
					mt: 8,
					p: 4,
					boxShadow: 3,
					borderRadius: 2,
					backgroundColor: 'background.paper',
				}}
			>
				{/* CENTER LOGO */}
				<Box display='flex' justifyContent='center' mb={2}>
					<AppLogo size={44} />
				</Box>

				<Typography variant='h5' textAlign='center' mb={3}>
					{title}
				</Typography>

				{children}
			</Box>
		</Container>
	);
};
