import {
	Box,
	Container,
	Typography,
	Stack,
	Grid,
	Avatar,
	IconButton,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import {
	MessageCircle,
	Video,
	FileText,
	Sparkles,
	ArrowRight,
} from 'lucide-react';
import { CtaButton } from '@/components/common/CtaButton';

export const HeroSection = () => {
	return (
		<Box
			sx={{
				position: 'relative',
				overflow: 'hidden',
				minHeight: '90vh',
				display: 'flex',
				alignItems: 'center',
				pt: 10,
				background:
					'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
			}}
		>
			{/* Background decorations */}
			<Box
				sx={{
					position: 'absolute',
					inset: 0,
					overflow: 'hidden',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: '-10%',
						right: '-10%',
						width: '320px',
						height: '320px',
						background:
							'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
						borderRadius: '50%',
					},
					'&::after': {
						content: '""',
						position: 'absolute',
						bottom: '-10%',
						left: '-10%',
						width: '320px',
						height: '320px',
						background:
							'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
						borderRadius: '50%',
					},
				}}
			/>

			<Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1 }}>
				<Grid container spacing={6} alignItems='center'>
					<Grid size={{ xs: 12, lg: 6 }}>
						<HeroContent />
					</Grid>
					<Grid size={{ xs: 12, lg: 6 }}>
						<ChatMockup />
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

const HeroContent = () => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
			{/* Badge */}
			<Box
				sx={{
					display: 'inline-flex',
					alignItems: 'center',
					gap: 1,
					px: 2,
					py: 1,
					borderRadius: '9999px',
					bgcolor: 'primary.50',
					color: 'primary.700',
					fontSize: '0.875rem',
					fontWeight: 600,
					width: 'fit-content',
				}}
			>
				<Box component='span' sx={{ display: 'flex', alignItems: 'center' }}>
					<Sparkles style={{ width: '16px', height: '16px' }} />
				</Box>
				Introducing Chat Assistant
			</Box>

			{/* Main Heading */}
			<Box>
				<Typography
					variant='h1'
					component='h1'
					sx={{
						fontWeight: 800,
						fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
						lineHeight: 1.1,
						color: 'text.primary',
						mb: 2,
					}}
				>
					Where Teams
					<Box
						component='span'
						sx={{
							display: 'block',
							background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}
					>
						Connect & Create
					</Box>
				</Typography>

				<Typography
					variant='h5'
					component='h2'
					sx={{
						color: 'text.secondary',
						mb: 3,
						fontSize: { xs: '1.125rem', md: '1.25rem' },
						lineHeight: 1.6,
					}}
				>
					ChatSphere combines real-time messaging, crystal-clear video calls,
					and powerful collaboration tools in one secure, intuitive platform.
				</Typography>
			</Box>

			{/* CTA Buttons */}
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={2}
				sx={{ alignItems: 'center' }}
			>
				<CtaButton to='/register' withArrow>
					Start Free Trial
				</CtaButton>
				{/* <CtaButton
					to='/demo'
					variant='outlined'
					sx={{
						color: 'primary.main',
						borderColor: 'primary.main',
						'&:hover': {
							borderColor: 'primary.dark',
							bgcolor: 'primary.50',
						},
					}}
				>
					<Box
						component='span'
						sx={{ display: 'flex', alignItems: 'center', mr: 1 }}
					>
						<Video style={{ width: '20px', height: '20px' }} />
					</Box>
					Watch Demo
				</CtaButton> */}
			</Stack>

			{/* Trust Indicators */}
			<TrustIndicators />
		</Box>
	);
};

const TrustIndicators = () => {
	return (
		<Box sx={{ pt: 4, borderTop: 1, borderColor: 'divider' }}>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={4}
				alignItems='center'
			>
				<Stack direction='row' spacing={1} alignItems='center'>
					<Stack direction='row' spacing={-1}>
						{[1, 2, 3, 4, 5].map((i) => (
							<Avatar
								key={i}
								sx={{
									width: 40,
									height: 40,
									border: '2px solid white',
									background:
										'linear-gradient(135deg, #60A5FA 0%, #818CF8 100%)',
								}}
							/>
						))}
					</Stack>
					<Box>
						<Typography
							variant='subtitle1'
							component='div'
							sx={{ fontWeight: 600 }}
						>
							15,000+ teams
						</Typography>
						<Typography variant='body2' component='div' color='text.secondary'>
							Trust ChatSphere
						</Typography>
					</Box>
				</Stack>

				<Stack direction='row' spacing={0.5} alignItems='center'>
					{[1, 2, 3, 4, 5].map((i) => (
						<Box
							key={i}
							component='span'
							sx={{
								fontSize: '1rem',
								color: 'warning.main',
								'&:before': {
									content: '"★"',
								},
							}}
						/>
					))}
					<Typography variant='body2' component='span' sx={{ ml: 1 }}>
						4.9/5 rating
					</Typography>
				</Stack>
			</Stack>
		</Box>
	);
};

const ChatMockup = () => {
	return (
		<Box sx={{ position: 'relative' }}>
			<Box
				sx={{
					position: 'absolute',
					inset: -16,
					background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
					borderRadius: 4,
					filter: 'blur(20px)',
					opacity: 0.1,
				}}
			/>
			<Box
				sx={{
					position: 'relative',
					borderRadius: 3,
					boxShadow: 24,
					overflow: 'hidden',
					bgcolor: 'white',
					p: 3,
				}}
			>
				{/* Chat Header */}
				<Stack
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					sx={{ mb: 3 }}
				>
					<Stack direction='row' alignItems='center' spacing={2}>
						<Avatar
							sx={{
								bgcolor: 'primary.main',
								width: 48,
								height: 48,
							}}
						>
							<MessageCircle style={{ width: '24px', height: '24px' }} />
						</Avatar>
						<Box>
							<Typography variant='h6' component='h3' sx={{ fontWeight: 600 }}>
								Design Team
							</Typography>
							<Typography
								variant='body2'
								component='div'
								color='text.secondary'
							>
								<Box
									component='span'
									sx={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: 0.5,
									}}
								>
									<Box
										sx={{
											width: 8,
											height: 8,
											borderRadius: '50%',
											bgcolor: 'success.main',
										}}
									/>
									12 online • 24 members
								</Box>
							</Typography>
						</Box>
					</Stack>
					<Stack direction='row' spacing={1}>
						<IconButton sx={{ width: 32, height: 32, bgcolor: 'grey.100' }}>
							<Video
								style={{ width: '16px', height: '16px', color: '#6B7280' }}
							/>
						</IconButton>
						<IconButton sx={{ width: 32, height: 32, bgcolor: 'grey.100' }}>
							<Settings sx={{ fontSize: '1rem', color: 'grey.700' }} />
						</IconButton>
					</Stack>
				</Stack>

				{/* Chat Messages */}
				<Stack spacing={2} sx={{ mb: 3 }}>
					<ChatMessage
						avatar='AJ'
						author='Alex Johnson'
						message='Just updated the design files. Let me know your thoughts!'
						time='2:30 PM • Seen'
						isOwn={false}
					/>
					<ChatMessage
						avatar='Y'
						author='You'
						message='Love the new layout! The colors work perfectly.'
						time='2:32 PM • Delivered'
						isOwn={true}
					/>
				</Stack>

				{/* Message Input */}
				<MessageInput />
			</Box>
		</Box>
	);
};

const ChatMessage = ({
	avatar,
	author,
	message,
	time,
	isOwn,
}: {
	avatar: string;
	author: string;
	message: string;
	time: string;
	isOwn: boolean;
}) => {
	return (
		<Stack
			direction='row'
			spacing={2}
			justifyContent={isOwn ? 'flex-end' : 'flex-start'}
		>
			{!isOwn && (
				<Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
					{avatar}
				</Avatar>
			)}
			<Box>
				<Box
					sx={{
						bgcolor: isOwn ? 'primary.main' : 'grey.50',
						color: isOwn ? 'white' : 'text.primary',
						borderRadius: 2,
						borderTopLeftRadius: isOwn ? 8 : 0,
						borderTopRightRadius: isOwn ? 0 : 8,
						p: 2,
						maxWidth: 280,
					}}
				>
					<Typography
						variant='subtitle2'
						component='div'
						sx={{ fontWeight: 600 }}
					>
						{author}
					</Typography>
					<Typography variant='body2' component='div' sx={{ mt: 0.5 }}>
						{message}
					</Typography>
					<Typography
						variant='caption'
						component='div'
						sx={{
							display: 'block',
							mt: 1,
							color: isOwn ? 'primary.100' : 'text.secondary',
						}}
					>
						{time}
					</Typography>
				</Box>
			</Box>
			{isOwn && (
				<Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
					{avatar}
				</Avatar>
			)}
		</Stack>
	);
};

const MessageInput = () => {
	return (
		<Stack direction='row' spacing={1} alignItems='center'>
			<IconButton sx={{ width: 40, height: 40, bgcolor: 'grey.100' }}>
				<FileText style={{ width: '16px', height: '16px', color: '#6B7280' }} />
			</IconButton>
			<Box
				component='input'
				placeholder='Type your message...'
				sx={{
					flex: 1,
					border: 1,
					borderColor: 'grey.300',
					borderRadius: 2,
					px: 2,
					py: 1.5,
					fontSize: '0.875rem',
					outline: 'none',
					'&:focus': {
						borderColor: 'primary.main',
						boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
					},
				}}
			/>
			<IconButton
				sx={{
					width: 40,
					height: 40,
					bgcolor: 'primary.main',
					'&:hover': {
						bgcolor: 'primary.dark',
					},
				}}
			>
				<ArrowRight style={{ width: '20px', height: '20px', color: 'white' }} />
			</IconButton>
		</Stack>
	);
};
