import React from 'react';
import {
	getMessageDimensions,
	type MessageAttachment,
} from '@/types/message.types';
import { ChatImage } from '../image/ChatImage';
import { ChatFile } from '../file/ChatFile';

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

	// Helper to get image display configuration
	const getImageConfig = () => {
		const dimensions = getMessageDimensions(message);

		if (!dimensions) {
			// No dimensions available, use defaults
			return {
				maxWidth: 300,
				minHeight: 150,
			};
		}

		// Calculate appropriate maxWidth based on aspect ratio
		const aspectRatio = dimensions.width / dimensions.height;
		let maxWidth = 300; // Default

		if (aspectRatio > 2) {
			// Very wide images - constrain more
			maxWidth = 250;
		} else if (aspectRatio < 0.5) {
			// Very tall images - give more width
			maxWidth = 200;
		}

		// Calculate minHeight based on aspect ratio
		let minHeight = 120;
		if (aspectRatio < 1) {
			// Portrait images - increase min height
			minHeight = 180;
		}

		return {
			maxWidth,
			minHeight,
		};
	};

	return (
		<div
			style={style}
			className={`px-3 py-1 flex ${!isMine ? 'justify-end' : 'justify-start'}`}
		>
			<div
				className={`
					max-w-[72%]
					px-3 py-2
					rounded-xl
					text-sm
					shadow
					${
						!isMine
							? 'bg-indigo-500 text-white rounded-br-sm'
							: 'bg-white text-gray-900 rounded-bl-sm'
					}
				`}
			>
				{/* Attachment */}
				{message.attachment && (
					<div className='mb-2'>
						{message.attachment.fileType === 'image' ? (
							<ChatImage
								chatId={chatId}
								fileKey={message.attachment.key}
								fileName={message.attachment.fileName}
								dimensions={message.attachment.dimensions}
								{...getImageConfig()}
								className={isMine ? 'rounded-br-sm' : 'rounded-bl-sm'}
							/>
						) : (
							<ChatFile
								chatId={chatId}
								fileKey={message.attachment.key}
								fileName={message.attachment.fileName}
								size={message.attachment.size}
								fileType={message.attachment.fileType}
								mimeType={message.attachment.mimeType}
								fixedHeight={true}
								className={isMine ? 'rounded-br-sm' : 'rounded-bl-sm'}
							/>
						)}
					</div>
				)}

				{/*  Text */}
				{message.content && (
					<p className='whitespace-pre-wrap'>{message.content}</p>
				)}

				{/* Time */}
				<div className='mt-1 text-[10px] opacity-60 text-right select-none'>
					{new Date(message.createdAt).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					})}
				</div>
			</div>
		</div>
	);
};
