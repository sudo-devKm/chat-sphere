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
