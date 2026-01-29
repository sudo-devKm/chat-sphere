import type { ReactNode } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

type FeatureCardProps = {
	icon: ReactNode;
	title: string;
	description: string;
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
	icon,
	description,
	title,
}) => {
	return (
		<Card
			sx={{
				height: '100%',
				textAlign: 'center',
				p: 3,
				transition: 'all 0.3s ease',
				'&:hover': {
					transform: 'translateY(-6px)',
					boxShadow: 6,
				},
			}}
		>
			<CardContent>
				<Box mb={2}>{icon}</Box>
				<Typography variant='h6' gutterBottom>
					{title}
				</Typography>
				<Typography color='text.secondary'>{description}</Typography>
			</CardContent>
		</Card>
	);
};
