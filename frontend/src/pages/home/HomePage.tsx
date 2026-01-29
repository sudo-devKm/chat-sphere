import { Box, Container, Typography, Button, Stack } from '@mui/material';
import GridLegacy from '@mui/material/GridLegacy';

import ChatIcon from '@mui/icons-material/Chat';
import CallIcon from '@mui/icons-material/Call';
import GroupIcon from '@mui/icons-material/Group';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { Navbar } from '@/components/common/Navbar';
import { FeatureCard } from '@/components/common/FeatureCard';
import { Link as RouterLink } from 'react-router';

export const HomePage = () => {
	return (
		<>
			<Navbar />

			{/* HERO SECTION (FULL WIDTH) */}
			<Box
				sx={{
					minHeight: '50vh',
					display: 'flex',
					alignItems: 'center',
					background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
					color: 'white',
				}}
			>
				<Container maxWidth={false}>
					<Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
						<Typography variant='h3' fontWeight={700} gutterBottom>
							Real-Time Communication, Simplified
						</Typography>

						<Typography variant='h6' mb={4}>
							ChatSphere helps teams and individuals communicate instantly
							through chat, voice, and video — all in one secure platform.
						</Typography>

						<Stack direction='row' spacing={2} justifyContent='center'>
							<Button
								component={RouterLink}
								to='/register'
								variant='contained'
								size='large'
								color='secondary'
							>
								Get Started
							</Button>

							<Button
								component={RouterLink}
								to='/login'
								variant='outlined'
								size='large'
								sx={{ color: 'white', borderColor: 'white' }}
							>
								Login
							</Button>
						</Stack>
					</Box>
				</Container>
			</Box>

			{/* FEATURES SECTION (FULL WIDTH) */}
			<Box sx={{ py: 10 }}>
				<Container maxWidth={false}>
					<Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
						<Typography variant='h4' textAlign='center' fontWeight={600} mb={6}>
							What Problems Do We Solve?
						</Typography>

						<GridLegacy container spacing={4}>
							<GridLegacy item xs={12} md={3}>
								<FeatureCard
									icon={<ChatIcon fontSize='large' color='primary' />}
									title='Instant Messaging'
									description='Real-time one-on-one and group chats with online presence.'
								/>
							</GridLegacy>

							<GridLegacy item xs={12} md={3}>
								<FeatureCard
									icon={<CallIcon fontSize='large' color='primary' />}
									title='Audio & Video Calls'
									description='High-quality voice and video calls using WebRTC & SIP.'
								/>
							</GridLegacy>

							<GridLegacy item xs={12} md={3}>
								<FeatureCard
									icon={<CloudUploadIcon fontSize='large' color='primary' />}
									title='File Sharing'
									description='Securely share documents, images, and media instantly.'
								/>
							</GridLegacy>

							<GridLegacy item xs={12} md={3}>
								<FeatureCard
									icon={<GroupIcon fontSize='large' color='primary' />}
									title='Team Collaboration'
									description='Create groups, manage users, and collaborate efficiently.'
								/>
							</GridLegacy>
						</GridLegacy>
					</Box>
				</Container>
			</Box>

			{/* CTA SECTION (FULL WIDTH) */}
			<Box
				sx={{
					py: 8,
					backgroundColor: 'primary.main',
					color: 'white',
				}}
			>
				<Container maxWidth={false}>
					<Box sx={{ textAlign: 'center' }}>
						<Typography variant='h5' fontWeight={600} gutterBottom>
							Ready to improve how you communicate?
						</Typography>

						<Button
							component={RouterLink}
							to='/register'
							variant='contained'
							size='large'
							color='secondary'
						>
							Create Free Account
						</Button>
					</Box>
				</Container>
			</Box>
		</>
	);
};
