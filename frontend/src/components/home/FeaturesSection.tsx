// src/components/home/FeaturesSection.tsx
import {
	Box,
	Typography,
	Grid,
	Card,
	CardContent,
	Avatar,
} from '@mui/material';
import { FlashOn, Smartphone } from '@mui/icons-material';
import {
	MessageCircle,
	Video,
	FileText,
	Users as UsersIcon,
	Globe as GlobeIcon,
	Shield as ShieldIcon,
	Zap as ZapIcon,
} from 'lucide-react';
import { SectionContainer } from '@/components/common/SectionContainer';

const features = [
	{
		icon: <MessageCircle style={{ width: '32px', height: '32px' }} />,
		title: 'Real-Time Chat',
		description: 'Instant messaging with rich formatting and reactions',
		color: 'primary',
	},
	{
		icon: <Video style={{ width: '32px', height: '32px' }} />,
		title: 'Video Calls',
		description: 'HD video conferencing with screen sharing',
		color: 'secondary',
	},
	{
		icon: <FileText style={{ width: '32px', height: '32px' }} />,
		title: 'File Sharing',
		description: 'Share documents, images, and videos instantly',
		color: 'success',
	},
	{
		icon: <ShieldIcon style={{ width: '32px', height: '32px' }} />,
		title: 'End-to-End Encryption',
		description: 'Your conversations are always private and secure',
		color: 'error',
	},
	{
		icon: <UsersIcon style={{ width: '32px', height: '32px' }} />,
		title: 'Team Channels',
		description: 'Organize conversations by project or team',
		color: 'info',
	},
	{
		icon: <ZapIcon style={{ width: '32px', height: '32px' }} />,
		title: 'AI Assistant',
		description: 'Get instant answers and summaries',
		color: 'warning',
	},
	{
		icon: <GlobeIcon style={{ width: '32px', height: '32px' }} />,
		title: 'Global Infrastructure',
		description: 'Low-latency servers worldwide',
		color: 'primary',
	},
	{
		icon: <Smartphone style={{ width: '32px', height: '32px' }} />,
		title: 'Cross-Platform',
		description: 'Web, desktop, iOS, and Android apps',
		color: 'secondary',
	},
];

export const FeaturesSection = () => {
	return (
		<SectionContainer variant='gradient'>
			<Box sx={{ textAlign: 'center', mb: 8 }}>
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
						mb: 3,
					}}
				>
					<FlashOn sx={{ fontSize: '1rem' }} />
					Powerful Features
				</Box>

				<Typography variant='h2' component='h2' sx={{ fontWeight: 700, mb: 2 }}>
					Everything You Need for
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
						Modern Collaboration
					</Box>
				</Typography>

				<Typography
					variant='h6'
					component='p'
					color='text.secondary'
					sx={{ maxWidth: 600, mx: 'auto' }}
				>
					Designed to help teams communicate better, work faster, and stay
					connected
				</Typography>
			</Box>

			<Grid container spacing={3}>
				{features.map((feature, index) => (
					<FeatureCard key={index} {...feature} />
				))}
			</Grid>
		</SectionContainer>
	);
};

const FeatureCard = ({
	icon,
	title,
	description,
	color,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	color: string;
}) => {
	return (
		<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
			<Card
				sx={{
					height: '100%',
					transition: 'all 0.3s ease',
					'&:hover': {
						transform: 'translateY(-8px)',
						boxShadow: 8,
					},
				}}
			>
				<CardContent sx={{ textAlign: 'center', p: 3 }}>
					<Avatar
						sx={{
							bgcolor: `${color}.50`,
							color: `${color}.main`,
							width: 64,
							height: 64,
							mx: 'auto',
							mb: 2,
						}}
					>
						{icon}
					</Avatar>
					<Typography
						variant='h6'
						component='h3'
						sx={{ fontWeight: 600, mb: 1 }}
					>
						{title}
					</Typography>
					<Typography variant='body2' component='p' color='text.secondary'>
						{description}
					</Typography>
				</CardContent>
			</Card>
		</Grid>
	);
};
