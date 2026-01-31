import {
	Box,
	Button,
	Typography,
	Container,
	Stack,
	keyframes,
} from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { Home, Search, Ghost, ArrowLeft } from 'lucide-react';

// Define the float animation using Material UI's keyframes
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

export const NotFoundPage = () => {
	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%)',
				p: 3,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Decorative elements */}
			<Box
				sx={{
					position: 'absolute',
					top: '10%',
					right: '10%',
					width: 200,
					height: 200,
					borderRadius: '50%',
					background:
						'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
				}}
			/>
			<Box
				sx={{
					position: 'absolute',
					bottom: '10%',
					left: '10%',
					width: 200,
					height: 200,
					borderRadius: '50%',
					background:
						'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
				}}
			/>

			<Container maxWidth='md'>
				<Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
					{/* Ghost Icon with floating animation */}
					<Box
						sx={{
							mb: 4,
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<Box
							sx={{
								animation: `${floatAnimation} 3s ease-in-out infinite`,
							}}
						>
							<Ghost
								size={100}
								style={{
									color: '#6366F1',
								}}
							/>
						</Box>
					</Box>

					{/* Error Code */}
					<Typography
						variant='h1'
						sx={{
							fontWeight: 900,
							fontSize: { xs: '4rem', sm: '6rem' },
							background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							mb: 2,
						}}
					>
						404
					</Typography>

					{/* Fun Title */}
					<Typography
						variant='h3'
						sx={{
							fontWeight: 700,
							color: 'text.primary',
							mb: 2,
						}}
					>
						Whoops! Lost in Cyberspace
					</Typography>

					{/* Creative Message */}
					<Typography
						variant='h6'
						sx={{
							color: 'text.secondary',
							mb: 4,
							maxWidth: 500,
							mx: 'auto',
							fontWeight: 400,
						}}
					>
						This page has vanished into the digital ether. Don't worry, even the
						best explorers get lost sometimes!
					</Typography>

					{/* Action Buttons */}
					<Stack
						direction={{ xs: 'column', sm: 'row' }}
						spacing={2}
						justifyContent='center'
					>
						<Button
							component={RouterLink}
							to='/'
							variant='contained'
							size='large'
							startIcon={<Home size={20} />}
							sx={{
								px: 4,
								py: 1.5,
								borderRadius: 2,
								fontWeight: 600,
							}}
						>
							Take Me Home
						</Button>

						<Button
							component={RouterLink}
							to='/login'
							variant='outlined'
							size='large'
							startIcon={<ArrowLeft size={20} />}
							sx={{
								px: 4,
								py: 1.5,
								borderRadius: 2,
								fontWeight: 600,
							}}
						>
							Back to Safety
						</Button>
					</Stack>

					{/* Search Tip */}
					<Box
						sx={{
							mt: 6,
							p: 3,
							borderRadius: 2,
							bgcolor: 'rgba(255, 255, 255, 0.8)',
							backdropFilter: 'blur(10px)',
							border: '1px solid rgba(255, 255, 255, 0.2)',
							maxWidth: 400,
							mx: 'auto',
						}}
					>
						<Stack
							direction='row'
							spacing={2}
							alignItems='center'
							justifyContent='center'
						>
							<Search size={20} style={{ color: '#6366F1' }} />
							<Typography variant='body2' sx={{ color: 'text.secondary' }}>
								Try using the search bar or navigation menu to find what you're
								looking for.
							</Typography>
						</Stack>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};
