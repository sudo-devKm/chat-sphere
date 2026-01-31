import React from 'react';
import { type MessageAttachment } from '@/types/message.types';
import { MessageBubble } from './MessageBubble';
import { MessageAttachmentContent } from './MessageAttachmentContent';
import { MessageTextContent } from './MessageTextContent';
import { MessageTime } from './MessageTime';

type MessageItem = {
	_id: string;
	content: string;
	senderId: string;
	createdAt: string;
	attachment?: MessageAttachment;
};

export type MessageRowData = {
	message: MessageItem;
	currentUserId: string;
	chatId: string;
	style?: React.CSSProperties;
	index: number;
};

export const Message = ({
	style,
	currentUserId,
	message,
	chatId,
}: MessageRowData) => {
	const isMine = message.senderId === currentUserId;
	const time = new Date(message.createdAt).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	});

	return (
		<div
			style={style}
			className={`px-4 py-2 flex ${!isMine ? 'justify-end' : 'justify-start'} group`}
		>
			<MessageBubble isMine={!isMine}>
				{message.attachment && (
					<MessageAttachmentContent
						chatId={chatId}
						attachment={message.attachment}
						isMine={!isMine}
					/>
				)}

				{message.content && <MessageTextContent content={message.content} />}

				<MessageTime time={time} isMine={!isMine} />
			</MessageBubble>
		</div>
	);
};
