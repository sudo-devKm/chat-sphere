import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { CallAvatar } from './CallAvatar';
import type { CallState } from '@/types/call.types';

interface CallPreviewContentProps {
	peerName: string;
	peerAvatar?: string;
	peerStatus?: 'online' | 'offline' | 'away';
	callType: 'audio' | 'video';
	callDirection: 'incoming' | 'outgoing';
	callState: CallState;
	timeLeft: number;
	isActiveCall: boolean;
}

export const CallPreviewContent = ({
	peerName,
	peerAvatar,
	callType,
	callDirection,
	callState,
	timeLeft,
	isActiveCall,
}: CallPreviewContentProps) => {
	const formatTimeLeft = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	return (
		<div className='flex flex-col items-center justify-center h-full w-full'>
			{/* Large Avatar - Centered */}
			<div className='mb-6'>
				<CallAvatar
					username={peerName}
					avatarUrl={peerAvatar}
					size='xlarge'
					className='border-4 border-white/30'
				/>
			</div>

			{/* Peer Name */}
			<div className='text-white text-2xl font-bold mb-2'>{peerName}</div>

			{/* Status */}
			<div className='text-gray-300 text-lg mb-4'>
				{callDirection === 'incoming'
					? callType === 'video'
						? 'Video call'
						: 'Voice call'
					: callState === 'calling'
						? 'Calling...'
						: 'Connecting...'}
			</div>

			{/* Timer for incoming calls */}
			{callDirection === 'incoming' && !isActiveCall && (
				<div className='flex items-center gap-2 text-gray-300'>
					<AccessTimeIcon className='w-5 h-5' />
					<span className='font-mono text-lg'>{formatTimeLeft(timeLeft)}</span>
				</div>
			)}
		</div>
	);
};
