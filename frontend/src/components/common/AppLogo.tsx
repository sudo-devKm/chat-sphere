import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';

interface Props {
	size?: number;
	showText?: boolean;
}

export const AppLogo = ({ size = 36, showText = true }: Props) => {
	return (
		<Box
			component={RouterLink}
			to='/'
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1,
				textDecoration: 'none',
				color: 'inherit',
			}}
		>
			{/* SVG LOGO */}
			<svg
				width={size}
				height={size}
				viewBox='0 0 100 100'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<circle cx='50' cy='50' r='45' fill='#1976d2' />
				<path
					d='M30 35C30 29.477 34.477 25 40 25H60C65.523 25 70 29.477 70 35V55C70 60.523 65.523 65 60 65H47L35 75V65H40C34.477 65 30 60.523 30 55V35Z'
					fill='white'
				/>
			</svg>

			{showText && (
				<Typography variant='h6' fontWeight={700} letterSpacing={0.5}>
					ChatSphere
				</Typography>
			)}
		</Box>
	);
};
