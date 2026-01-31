import { ChatHeader } from './ChatHeader';
import type { UserResponse } from '@/types/auth.types';
import type { CallType } from '@/types/call.types';
import { MessageList } from './message-list/MessageList';
import { MessageInput } from './message-input/MessageInput';
import { CircularProgress } from '@mui/material';

interface ChatContainerProps {
	userId: string;
	user: UserResponse;
	isOnline: boolean;
	loading: boolean;
	chatId: string | null;
	startCall: (
		type: CallType,
		userData: { userId: string; username: string },
	) => void;
	disableCalls?: boolean;
}

export const ChatContainer = ({
	userId,
	user,
	isOnline,
	startCall,
	loading,
	chatId,
	disableCalls = false,
}: ChatContainerProps) => {
	if (loading) {
		return (
			<div className='h-full flex flex-col items-center justify-center bg-gray-50'>
				<CircularProgress size={40} className='text-indigo-600' />
				<p className='mt-4 text-gray-600'>Loading chat...</p>
			</div>
		);
	}

	if (!chatId) {
		return (
			<div className='h-full flex flex-col items-center justify-center bg-gray-50'>
				<div className='w-16 h-16 mb-4 text-gray-300'>
					<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1.5}
							d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
				</div>
				<h3 className='text-lg font-medium text-gray-700 mb-2'>
					Unable to Load Chat
				</h3>
				<p className='text-sm text-gray-500 text-center max-w-sm'>
					There was a problem loading the chat. Please try again or select
					another user.
				</p>
			</div>
		);
	}

	return (
		<div className='h-full flex flex-col min-h-0 overflow-hidden bg-white'>
			<ChatHeader
				user={user}
				isOnline={isOnline}
				onAudioCall={() =>
					startCall('audio', { userId: userId, username: user.username })
				}
				onVideoCall={() =>
					startCall('video', { userId: userId, username: user.username })
				}
				disableCalls={disableCalls}
			/>
			<MessageList userId={userId} chatId={chatId} />
			<MessageInput userId={userId} chatId={chatId} />
		</div>
	);
};
