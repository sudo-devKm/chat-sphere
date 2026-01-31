import { Box } from '@mui/material';
import type { UserResponse } from '@/types/auth.types';
import { UserInfo } from './UserInfo';
import { CallButtons } from './CallButtons';

interface ChatHeaderProps {
	user: UserResponse & { lastSeen?: string };
	isOnline: boolean;
	onAudioCall: () => void;
	onVideoCall: () => void;
	disableCalls?: boolean;
}

export const ChatHeader = ({
	user,
	isOnline,
	onAudioCall,
	onVideoCall,
	disableCalls = false,
}: ChatHeaderProps) => {
	return (
		<Box className='flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-linear-to-r from-white to-gray-50/50 shadow-sm'>
			<UserInfo user={user} isOnline={isOnline} />
			<CallButtons
				isOnline={isOnline}
				disableCalls={disableCalls}
				onAudioCall={onAudioCall}
				onVideoCall={onVideoCall}
			/>
		</Box>
	);
};
