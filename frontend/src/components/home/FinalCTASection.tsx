// src/components/home/FinalCTASection.tsx
import { Box, Container, Typography, Stack } from '@mui/material';
import {
	WorkspacePremium,
	CheckCircle,
	Lock,
	AccessTime,
} from '@mui/icons-material';
import { CtaButton } from '@/components/common/CtaButton';

export const FinalCTASection = () => {
	return (
		<Box
			sx={{
				py: { xs: 8, md: 12 },
				px: 3,
				bgcolor: 'grey.900',
				color: 'white',
				textAlign: 'center',
			}}
		>
			<Container maxWidth='md'>
				<WorkspacePremium
					sx={{ fontSize: 64, mb: 3, color: 'primary.light' }}
				/>

				<Typography
					variant='h2'
					component='h2'
					sx={{ fontWeight: 700, mb: 3, color: 'white' }}
				>
					Ready to Transform Your Team Communication?
				</Typography>

				<Typography
					variant='h6'
					component='p'
					sx={{ mb: 4, color: 'grey.300' }}
				>
					Join thousands of teams that trust ChatSphere. No credit card
					required.
				</Typography>

				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={2}
					justifyContent='center'
				>
					<CtaButton
						to='/register'
						sx={{
							bgcolor: 'white',
							color: 'grey.900',
							'&:hover': {
								bgcolor: 'grey.100',
							},
						}}
						withArrow
					>
						Get Started Free
					</CtaButton>
					<CtaButton
						to='/contact'
						variant='outlined'
						sx={{
							color: 'white',
							borderColor: 'grey.700',
							'&:hover': {
								borderColor: 'white',
								bgcolor: 'rgba(255, 255, 255, 0.1)',
							},
						}}
					>
						Contact Sales
					</CtaButton>
				</Stack>

				<Stack
					direction='row'
					spacing={4}
					justifyContent='center'
					sx={{ mt: 4 }}
				>
					<Stack direction='row' spacing={1} alignItems='center'>
						<CheckCircle sx={{ fontSize: '1rem', color: 'grey.400' }} />
						<Typography variant='body2' component='span' color='grey.400'>
							14-day free trial
						</Typography>
					</Stack>
					<Stack direction='row' spacing={1} alignItems='center'>
						<Lock sx={{ fontSize: '1rem', color: 'grey.400' }} />
						<Typography variant='body2' component='span' color='grey.400'>
							Enterprise security
						</Typography>
					</Stack>
					<Stack direction='row' spacing={1} alignItems='center'>
						<AccessTime sx={{ fontSize: '1rem', color: 'grey.400' }} />
						<Typography variant='body2' component='span' color='grey.400'>
							24/7 support
						</Typography>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
};
