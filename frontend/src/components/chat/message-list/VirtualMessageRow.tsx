import { Message } from '../message/Message';
import { Virtualizer } from '@tanstack/react-virtual';

interface VirtualMessageRowProps {
	virtualRow: any;
	message: any;
	rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
	chatId: string;
	userId: string;
	index: number;
}

export const VirtualMessageRow = ({
	virtualRow,
	message,
	rowVirtualizer,
	chatId,
	userId,
	index,
}: VirtualMessageRowProps) => {
	return (
		<div
			data-index={index}
			// tanstack-virtual's documented API for dynamic row measurement;
			// this assigns a callback ref, not a render-time ref read.
			// eslint-disable-next-line react-hooks/refs
			ref={rowVirtualizer.measureElement}
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				transform: `translateY(${virtualRow.start}px)`,
			}}
			className='transition-opacity duration-300'
		>
			<Message
				chatId={chatId}
				message={message}
				currentUserId={userId}
				index={index}
			/>
		</div>
	);
};
