import { useRef, useCallback } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { useChatMessages } from '@/hooks/useChatMessages';
import { Message } from '../message/Message';

export const MessageList = ({
	userId,
	chatId,
}: {
	userId: string;
	chatId: string;
}) => {
	const { messages, loadOlder, hasMore, loading, total } =
		useChatMessages(chatId);
	const virtuosoRef = useRef<VirtuosoHandle>(null);

	// We use the total count to determine where in the "virtual"
	// timeline our current slice of messages begins.
	// If total is 100 and we have 20 messages, our first item index is 80.
	const firstItemIndex = Math.max(0, total - messages.length);

	const handleStartReached = useCallback(() => {
		if (!hasMore || loading) return;
		loadOlder();
	}, [hasMore, loading, loadOlder]);

	const Header = useCallback(() => {
		return (
			<div
				style={{ height: '60px' }}
				className='flex items-center justify-center w-full'
			>
				{loading ? (
					<div className='flex items-center gap-2 text-sm text-gray-400'>
						{/* Replace with a proper Spinner component if you have one */}
						<div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
						<span>Loading older messages...</span>
					</div>
				) : !hasMore && messages.length > 0 ? (
					<span className='text-gray-400 text-sm'>
						Beginning of conversation
					</span>
				) : null}
			</div>
		);
	}, [loading, hasMore, messages.length]);

	return (
		<div className='flex-1 min-h-0 bg-gray-50'>
			<Virtuoso
				ref={virtuosoRef}
				data={messages}
				firstItemIndex={firstItemIndex}
				// Start at the end of the current data array
				initialTopMostItemIndex={messages.length - 1}
				startReached={handleStartReached}
				overscan={600} // Increased for smoother fast-scrolling
				alignToBottom
				followOutput={(isAtBottom) => (isAtBottom ? 'smooth' : false)}
				itemContent={(index, message) => (
					<Message
						chatId={chatId}
						message={message}
						currentUserId={userId}
						index={index}
						key={message._id}
					/>
				)}
				components={{ Header }}
				className='h-full'
			/>
		</div>
	);
};
