// src/components/home/TestimonialsSection.tsx
import {
	Box,
	Typography,
	Grid,
	Card,
	Stack,
	Avatar,
	Rating,
} from '@mui/material';
import { SectionContainer } from '@/components/common/SectionContainer';

const testimonials = [
	{
		name: 'Sarah Chen',
		role: 'CTO at TechFlow',
		content: 'ChatSphere has transformed how our remote team communicates.',
		avatar: 'SC',
	},
	{
		name: 'Marcus Rodriguez',
		role: 'Product Manager',
		content: "The best team communication tool we've ever used.",
		avatar: 'MR',
	},
	{
		name: 'Priya Sharma',
		role: 'Engineering Lead',
		content: 'Security features give us complete peace of mind.',
		avatar: 'PS',
	},
];

export const TestimonialsSection = () => {
	return (
		<SectionContainer variant='gradient'>
			<Box sx={{ textAlign: 'center', mb: 8 }}>
				<Typography variant='h2' component='h2' sx={{ fontWeight: 700, mb: 2 }}>
					Loved by Teams Worldwide
				</Typography>
			</Box>

			<Grid container spacing={3}>
				{testimonials.map((testimonial, index) => (
					<Grid size={{ xs: 12, md: 4 }} key={index}>
						<TestimonialCard {...testimonial} />
					</Grid>
				))}
			</Grid>
		</SectionContainer>
	);
};

const TestimonialCard = ({
	name,
	role,
	content,
	avatar,
}: {
	name: string;
	role: string;
	content: string;
	avatar: string;
}) => {
	return (
		<Card sx={{ p: 3, height: '100%' }}>
			<Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 2 }}>
				<Avatar
					sx={{
						bgcolor: 'primary.main',
						width: 48,
						height: 48,
					}}
				>
					{avatar}
				</Avatar>
				<Box>
					<Typography
						variant='subtitle1'
						component='div'
						sx={{ fontWeight: 600 }}
					>
						{name}
					</Typography>
					<Typography variant='body2' component='div' color='text.secondary'>
						{role}
					</Typography>
				</Box>
			</Stack>
			<Rating value={5} readOnly size='small' sx={{ mb: 2 }} />
			<Typography
				variant='body1'
				component='p'
				color='text.secondary'
				sx={{ fontStyle: 'italic' }}
			>
				"{content}"
			</Typography>
		</Card>
	);
};
