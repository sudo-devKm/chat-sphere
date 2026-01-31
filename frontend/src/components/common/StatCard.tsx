import { Typography, type TypographyProps } from '@mui/material';

interface StatCardProps {
	number: string;
	label: string;
	suffix?: string;
	color?: TypographyProps['color'];
}

export const StatCard = ({
	number,
	label,
	suffix = '+',
	color = 'primary.main',
}: StatCardProps) => {
	return (
		<div>
			<Typography
				variant='h2'
				sx={{
					fontWeight: 800,
					fontSize: { xs: '2.5rem', md: '3rem' },
					color,
					mb: 1,
				}}
			>
				{number}
				<Typography
					component='span'
					sx={{
						fontSize: '0.6em',
						opacity: 0.7,
					}}
				>
					{suffix}
				</Typography>
			</Typography>
			<Typography variant='subtitle1' color='text.secondary'>
				{label}
			</Typography>
		</div>
	);
};
