// src/components/common/AppLogo.tsx
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { MessageCircle } from 'lucide-react';

interface Props {
	size?: number;
	showText?: boolean;
	variant?: 'default' | 'gradient' | 'minimal';
	clickable?: boolean;
}

export const AppLogo = ({
	size = 40,
	showText = true,
	variant = 'default',
	clickable = true,
}: Props) => {
	const renderLogoIcon = () => {
		switch (variant) {
			case 'minimal':
				return (
					<Box
						sx={{
							width: size,
							height: size,
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: 'primary.main',
							color: 'white',
						}}
					>
						<MessageCircle size={size * 0.6} />
					</Box>
				);

			case 'gradient':
				return (
					<Box
						sx={{
							width: size,
							height: size,
							borderRadius: 2,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
							color: 'white',
							position: 'relative',
							'&::before': {
								content: '""',
								position: 'absolute',
								inset: -2,
								borderRadius: 'inherit',
								background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
								opacity: 0.3,
								filter: 'blur(4px)',
							},
						}}
					>
						<MessageCircle size={size * 0.6} />
					</Box>
				);

			default:
				return (
					<Box
						sx={{
							position: 'relative',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: -4,
								left: -4,
								right: -4,
								bottom: -4,
								borderRadius: '50%',
								background:
									'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
								zIndex: 0,
							},
						}}
					>
						<svg
							width={size}
							height={size}
							viewBox='0 0 100 100'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							style={{ position: 'relative', zIndex: 1 }}
						>
							{/* Modern gradient circle */}
							<defs>
								<linearGradient
									id='logoGradient'
									x1='0%'
									y1='0%'
									x2='100%'
									y2='100%'
								>
									<stop offset='0%' stopColor='#3B82F6' />
									<stop offset='100%' stopColor='#6366F1' />
								</linearGradient>
							</defs>
							<circle cx='50' cy='50' r='45' fill='url(#logoGradient)' />

							{/* Modern chat bubble */}
							<path
								d='M30 35C30 29.477 34.477 25 40 25H60C65.523 25 70 29.477 70 35V55C70 60.523 65.523 65 60 65H50L38 72V65H40C34.477 65 30 60.523 30 55V35Z'
								fill='white'
								fillOpacity='0.95'
							/>

							{/* Decorative dot */}
							<circle cx='45' cy='45' r='3' fill='white' fillOpacity='0.8' />
							<circle cx='55' cy='45' r='3' fill='white' fillOpacity='0.8' />
						</svg>
					</Box>
				);
		}
	};

	const renderText = () => {
		if (!showText) return null;

		switch (variant) {
			case 'gradient':
				return (
					<Typography
						variant='h6'
						sx={{
							fontWeight: 800,
							background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							letterSpacing: '0.5px',
							fontSize: { xs: '1.1rem', sm: '1.25rem' },
						}}
					>
						ChatSphere
					</Typography>
				);

			default:
				return (
					<Typography
						variant='h6'
						sx={{
							fontWeight: 700,
							color: 'primary.main',
							letterSpacing: '0.5px',
							fontSize: { xs: '1.1rem', sm: '1.25rem' },
						}}
					>
						ChatSphere
					</Typography>
				);
		}
	};

	const logoContent = (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1.5,
				textDecoration: 'none',
				color: 'inherit',
				transition: 'transform 0.2s ease',
				...(clickable && {
					'&:hover': {
						transform: 'translateY(-1px)',
					},
				}),
			}}
		>
			{renderLogoIcon()}
			{renderText()}
		</Box>
	);

	if (clickable) {
		return (
			<Box component={RouterLink} to='/' sx={{ textDecoration: 'none' }}>
				{logoContent}
			</Box>
		);
	}

	return logoContent;
};
