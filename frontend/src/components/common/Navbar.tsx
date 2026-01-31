import {
	AppBar,
	Toolbar,
	Button,
	Box,
	Stack,
	Typography,
	Container,
	useTheme,
	useScrollTrigger,
	Slide,
} from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { MessageCircle, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HideOnScrollProps {
	children: React.ReactElement;
}

function HideOnScroll({ children }: HideOnScrollProps) {
	const trigger = useScrollTrigger();

	return (
		<Slide appear={false} direction='down' in={!trigger}>
			{children}
		</Slide>
	);
}

export const Navbar: React.FC = () => {
	const theme = useTheme();
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<HideOnScroll>
			<AppBar
				position='sticky'
				elevation={scrolled ? 4 : 0}
				sx={{
					backdropFilter: scrolled ? 'blur(10px)' : 'blur(8px)',
					backgroundColor: scrolled
						? 'rgba(255, 255, 255, 0.95)'
						: 'rgba(255, 255, 255, 0.9)',
					borderBottom: scrolled
						? '1px solid rgba(0, 0, 0, 0.08)'
						: '1px solid transparent',
					transition: 'all 0.3s ease-in-out',
					py: scrolled ? 0.5 : 0,
				}}
			>
				<Container maxWidth='xl'>
					<Toolbar
						sx={{
							justifyContent: 'space-between',
							px: { xs: 0, sm: 2 },
							minHeight: { xs: 64, md: 72 },
						}}
						disableGutters
					>
						{/* Logo Section */}
						<Box
							component={RouterLink}
							to='/'
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1.5,
								textDecoration: 'none',
								transition: 'transform 0.3s ease',
								'&:hover': { transform: 'translateY(-1px)' },
							}}
						>
							<Box
								sx={{
									width: 40,
									height: 40,
									borderRadius: 2,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									background:
										'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
									color: 'white',
								}}
							>
								<MessageCircle size={22} />
							</Box>
							<Box sx={{ display: 'flex', flexDirection: 'column' }}>
								<Typography
									variant='h6'
									sx={{
										fontWeight: 800,
										background:
											'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
										backgroundClip: 'text',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										lineHeight: 1,
										fontSize: { xs: '1.25rem', md: '1.5rem' },
									}}
								>
									ChatSphere
								</Typography>
							</Box>
						</Box>

						{/* Auth Buttons */}
						<Stack
							direction='row'
							spacing={2}
							alignItems='center'
							sx={{
								transition: 'all 0.3s ease',
								opacity: scrolled ? 0.9 : 1,
							}}
						>
							<Button
								component={RouterLink}
								to='/login'
								variant='text'
								sx={{
									color: 'text.secondary',
									textTransform: 'none',
									fontWeight: 500,
									fontSize: '0.95rem',
									px: { xs: 1.5, sm: 2.5 },
									borderRadius: 2,
									transition: 'all 0.2s ease',
									'&:hover': {
										color: 'primary.main',
										backgroundColor: 'primary.50',
										transform: 'translateY(-1px)',
									},
								}}
							>
								Sign In
							</Button>

							<Button
								component={RouterLink}
								to='/register'
								variant='contained'
								sx={{
									textTransform: 'none',
									fontWeight: 600,
									fontSize: '0.95rem',
									px: { xs: 2, sm: 3 },
									py: 0.9,
									borderRadius: 2,
									background:
										'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
									boxShadow: scrolled
										? '0 4px 12px rgba(59, 130, 246, 0.25)'
										: '0 6px 20px rgba(59, 130, 246, 0.3)',
									transition: 'all 0.3s ease',
									position: 'relative',
									overflow: 'hidden',
									'&:before': {
										content: '""',
										position: 'absolute',
										top: 0,
										left: '-100%',
										width: '100%',
										height: '100%',
										background:
											'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
										transition: '0.5s',
									},
									'&:hover': {
										background:
											'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
										boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
										transform: 'translateY(-2px)',
										'&:before': {
											left: '100%',
										},
									},
									'&:active': {
										transform: 'translateY(0)',
										boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
									},
								}}
							>
								Get Started Free
							</Button>
						</Stack>
					</Toolbar>
				</Container>
			</AppBar>
		</HideOnScroll>
	);
};
