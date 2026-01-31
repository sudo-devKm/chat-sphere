import type React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { MessageCircle } from 'lucide-react';
import { Link as RouterLink } from 'react-router';

type AuthLayoutProps = {
	title: string;
	children: React.ReactNode;
	subtitle?: string;
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({
	children,
	title,
	subtitle,
}) => {
	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background:
					'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(99, 102, 241, 0.03) 100%)',
				p: { xs: 2, sm: 3 },
			}}
		>
			<Container maxWidth='sm'>
				{/* Make Logo Clickable to Home */}
				<Box
					component={RouterLink}
					to='/'
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						mb: 4,
						textDecoration: 'none',
						transition: 'transform 0.2s ease',
						'&:hover': {
							transform: 'translateY(-2px)',
						},
					}}
				>
					<Box
						sx={{
							width: 56,
							height: 56,
							borderRadius: 2,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
							color: 'white',
							mr: 2,
						}}
					>
						<MessageCircle size={28} />
					</Box>
					<Box>
						<Typography
							variant='h4'
							sx={{
								fontWeight: 800,
								background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
								backgroundClip: 'text',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								lineHeight: 1.2,
							}}
						>
							ChatSphere
						</Typography>
						<Typography
							variant='caption'
							sx={{
								color: 'primary.main',
								fontWeight: 500,
								letterSpacing: '0.5px',
							}}
						>
							Secure Team Communication
						</Typography>
					</Box>
				</Box>

				<Paper
					elevation={0}
					sx={{
						p: { xs: 3, sm: 4 },
						borderRadius: 3,
						border: '1px solid',
						borderColor: 'divider',
						backgroundColor: 'white',
						boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
					}}
				>
					{/* Title Section */}
					<Box sx={{ textAlign: 'center', mb: 4 }}>
						<Typography
							variant='h5'
							component='h1'
							sx={{
								fontWeight: 700,
								mb: 1,
								color: 'text.primary',
								fontSize: { xs: '1.5rem', sm: '1.75rem' },
							}}
						>
							{title}
						</Typography>
						{subtitle && (
							<Typography
								variant='body1'
								sx={{ color: 'text.secondary', fontSize: '0.95rem' }}
							>
								{subtitle}
							</Typography>
						)}
					</Box>

					{children}

					{/* Security Note */}
					<Box
						sx={{
							mt: 4,
							pt: 3,
							borderTop: '1px solid',
							borderColor: 'divider',
							textAlign: 'center',
						}}
					>
						<Typography
							variant='caption'
							sx={{
								color: 'text.secondary',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 1,
							}}
						>
							<Box
								sx={{
									width: 6,
									height: 6,
									borderRadius: '50%',
									backgroundColor: 'success.main',
								}}
							/>
							Your data is encrypted and secure
						</Typography>
					</Box>
				</Paper>

				{/* Footer */}
				<Box sx={{ textAlign: 'center', mt: 4 }}>
					<Typography variant='caption' sx={{ color: 'text.secondary' }}>
						© {new Date().getFullYear()} ChatSphere. All rights reserved.
					</Typography>
				</Box>
			</Container>
		</Box>
	);
};
