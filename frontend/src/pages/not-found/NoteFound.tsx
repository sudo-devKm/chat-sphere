import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';

export const NotFoundPage = () => {
	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
				px: 2,
			}}
		>
			<Typography variant='h1' fontWeight={800} color='primary'>
				404
			</Typography>

			<Typography variant='h5' mb={2}>
				Page not found
			</Typography>

			<Typography color='text.secondary' mb={4}>
				The page you’re looking for doesn’t exist or was moved.
			</Typography>

			<Button component={RouterLink} to='/' variant='contained' size='large'>
				Go to Home
			</Button>
		</Box>
	);
};
