import { Typography } from '@mui/material';
import { CallAvatar } from './CallAvatar';
import { CallTimer } from './CallTimer';
import type { CallState } from '@/types/call.types';

interface CallStatusHeaderProps {
	peerName: string;
	peerAvatar?: string;
	callType: 'audio' | 'video';
	peerStatus?: 'online' | 'offline' | 'away';
	callState: CallState;
	callDirection: 'incoming' | 'outgoing';
	callStartTime?: Date;
}

export const CallStatusHeader = ({
	peerName,
	peerAvatar,
	callType,
	callStartTime,
}: CallStatusHeaderProps) => {
	const getCallStatusText = () => {
		return callType === 'video' ? 'Video call' : 'Voice call';
	};

	return (
		<div className='flex items-center justify-between p-6 text-white'>
			<div className='flex items-center gap-3'>
				<CallAvatar username={peerName} avatarUrl={peerAvatar} size='small' />
				<div>
					<Typography variant='h6' fontWeight={600} className='text-white'>
						{peerName}
					</Typography>
					<Typography variant='caption' className='text-white/80'>
						{getCallStatusText()}
					</Typography>
				</div>
			</div>

			<div className='flex items-center gap-4'>
				{callStartTime && <CallTimer startTime={callStartTime} />}
			</div>
		</div>
	);
};
