// src/components/home/StatsSection.tsx
import { Box, Typography, Grid } from '@mui/material';
import { SectionContainer } from '@/components/common/SectionContainer';
import { StatCard } from '@/components/common/StatCard';

export const StatsSection = () => {
	return (
		<SectionContainer>
			<Box sx={{ textAlign: 'center', mb: 8 }}>
				<Typography variant='h2' component='h2' sx={{ fontWeight: 700, mb: 2 }}>
					Trusted by Growing Teams
				</Typography>
				<Typography
					variant='h6'
					component='p'
					color='text.secondary'
					sx={{ maxWidth: 600, mx: 'auto' }}
				>
					Join thousands of teams that rely on ChatSphere for seamless
					communication
				</Typography>
			</Box>

			<Grid container spacing={4} sx={{ textAlign: 'center' }}>
				<Grid size={{ xs: 6, md: 3 }}>
					<StatCard number='50K' label='Active Users' color='primary.main' />
				</Grid>
				<Grid size={{ xs: 6, md: 3 }}>
					<StatCard
						number='10M'
						label='Messages Daily'
						color='secondary.main'
					/>
				</Grid>
				<Grid size={{ xs: 6, md: 3 }}>
					<StatCard number='99.9' label='Uptime' suffix='%' color='purple' />
				</Grid>
				<Grid size={{ xs: 6, md: 3 }}>
					<StatCard number='150' label='Countries' color='success.main' />
				</Grid>
			</Grid>
		</SectionContainer>
	);
};
