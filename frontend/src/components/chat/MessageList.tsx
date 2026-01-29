import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useChatMessages } from '@/hooks/useChatMessages';
import { Message } from './Message';

export const MessageList = ({
	userId,
	chatId,
}: {
	userId: string;
	chatId: string;
}) => {
	const { messages, loadOlder, hasMore, loading } = useChatMessages(chatId);

	const parentRef = useRef<HTMLDivElement>(null);
	const prevScrollHeightRef = useRef<number | null>(null);
	const initialScrollDoneRef = useRef(false);
	const shouldAutoScrollRef = useRef(true);

	const rowVirtualizer = useVirtualizer({
		count: messages.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 72, // avg message height
		overscan: 10,
	});

	/* -------------------------------
	   Initial scroll to bottom
	-------------------------------- */
	useEffect(() => {
		if (!messages.length || initialScrollDoneRef.current === true) return;

		// Wait until virtualizer has measurements
		requestAnimationFrame(() => {
			rowVirtualizer.scrollToIndex(messages.length - 1, {
				align: 'end',
			});
			initialScrollDoneRef.current = true;
		});
	}, [messages.length, chatId, rowVirtualizer]);

	// Auto-scroll on new messages ONLY if user is at bottom
	useEffect(() => {
		if (!messages.length) return;

		if (shouldAutoScrollRef.current) {
			requestAnimationFrame(() => {
				rowVirtualizer.scrollToIndex(messages.length - 1, {
					align: 'end',
				});
			});
		}
	}, [messages.length, rowVirtualizer]);

	/* -----------------------------------------
	   Maintain scroll when older messages load
	------------------------------------------ */
	useEffect(() => {
		const el = parentRef.current;
		if (!el || prevScrollHeightRef.current === null) return;

		const newHeight = el.scrollHeight;
		el.scrollTop = newHeight - prevScrollHeightRef.current;
		prevScrollHeightRef.current = null;
	}, [messages]);

	/* -------------------------------
	   Scroll handler
	-------------------------------- */
	const onScroll = () => {
		const el = parentRef.current;
		if (!el || loading) return;

		shouldAutoScrollRef.current =
			el.scrollHeight - el.scrollTop - el.clientHeight < 40;
		// Load older messages when scrolled to top
		if (el.scrollTop === 0 && hasMore) {
			prevScrollHeightRef.current = el.scrollHeight;
			loadOlder();
		}
	};

	return (
		<div
			ref={parentRef}
			className='flex-1 min-h-0 overflow-y-auto bg-gray-50'
			onScroll={onScroll}
		>
			<div
				style={{
					height: rowVirtualizer.getTotalSize(),
					position: 'relative',
				}}
			>
				{rowVirtualizer.getVirtualItems().map((virtualRow) => {
					const message = messages[virtualRow.index];

					return (
						<div
							data-index={virtualRow.index}
							key={message._id}
							ref={rowVirtualizer.measureElement}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								transform: `translateY(${virtualRow.start}px)`,
							}}
						>
							<Message
								chatId={chatId}
								message={message}
								currentUserId={userId}
								index={virtualRow.index}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};
