import { AppBar, Button, Stack, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';

export const Navbar: React.FC = () => {
	return (
		<AppBar
			position='sticky'
			elevation={1}
			sx={{
				backdropFilter: 'blur(8px)',
				backgroundColor: 'rgba(255,255,255,0.9)',
			}}
		>
			<Toolbar sx={{ justifyContent: 'space-between' }}>
				<Typography variant='h6' fontWeight={700} color='primary'>
					ChatSphere
				</Typography>

				<Stack direction='row' spacing={2}>
					<Button component={RouterLink} to='/login'>
						Login
					</Button>
					<Button component={RouterLink} to='/register' variant='contained'>
						Register
					</Button>
				</Stack>
			</Toolbar>
		</AppBar>
	);
};
