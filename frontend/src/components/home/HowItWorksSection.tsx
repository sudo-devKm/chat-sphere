// src/components/home/HowItWorksSection.tsx
import { Box, Typography, Grid, Card } from '@mui/material';
import { SectionContainer } from '@/components/common/SectionContainer';

const steps = [
	{
		step: '1',
		title: 'Create Account',
		description: 'Sign up for free in 30 seconds',
		icon: '🚀',
	},
	{
		step: '2',
		title: 'Invite Team',
		description: 'Add your team members instantly',
		icon: '👥',
	},
	{
		step: '3',
		title: 'Start Chatting',
		description: 'Create channels and begin collaborating',
		icon: '💬',
	},
	{
		step: '4',
		title: 'Scale Up',
		description: 'Add integrations and automations',
		icon: '⚡',
	},
];

export const HowItWorksSection = () => {
	return (
		<SectionContainer>
			<Box sx={{ textAlign: 'center', mb: 8 }}>
				<Typography variant='h2' component='h2' sx={{ fontWeight: 700, mb: 2 }}>
					Simple Setup, Instant Results
				</Typography>
				<Typography
					variant='h6'
					component='p'
					color='text.secondary'
					sx={{ maxWidth: 600, mx: 'auto' }}
				>
					Get your team up and running in minutes
				</Typography>
			</Box>

			<Grid container spacing={4}>
				{steps.map((item) => (
					<StepCard key={item.step} {...item} />
				))}
			</Grid>
		</SectionContainer>
	);
};

const StepCard = ({
	step,
	title,
	description,
	icon,
}: {
	step: string;
	title: string;
	description: string;
	icon: string;
}) => {
	return (
		<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
			<Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
				<Box sx={{ position: 'relative', mb: 3 }}>
					<Box
						sx={{
							width: 80,
							height: 80,
							mx: 'auto',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '2rem',
							bgcolor: 'primary.50',
							borderRadius: 2,
						}}
					>
						{icon}
					</Box>
					<Box
						sx={{
							position: 'absolute',
							top: -8,
							right: -8,
							width: 32,
							height: 32,
							bgcolor: 'primary.main',
							color: 'white',
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '0.875rem',
							fontWeight: 700,
						}}
					>
						{step}
					</Box>
				</Box>
				<Typography variant='h6' component='h3' sx={{ fontWeight: 600, mb: 1 }}>
					{title}
				</Typography>
				<Typography variant='body2' component='p' color='text.secondary'>
					{description}
				</Typography>
			</Card>
		</Grid>
	);
};
