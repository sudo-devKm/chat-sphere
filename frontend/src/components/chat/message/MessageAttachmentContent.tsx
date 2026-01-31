import { ChatFile } from '@/components/file/ChatFile';
import { ChatImage } from '@/components/image/ChatImage';
import { useImageConfig } from '@/hooks/useImageConfig';
import { type MessageAttachment } from '@/types/message.types';

interface MessageAttachmentContentProps {
	chatId: string;
	attachment: MessageAttachment;
	isMine: boolean;
}

export const MessageAttachmentContent = ({
	chatId,
	attachment,
	isMine,
}: MessageAttachmentContentProps) => {
	const imageConfig = useImageConfig(attachment);

	const attachmentClassName = `
		rounded-lg shadow-md transition-transform duration-300 
		hover:scale-[1.02]
		${isMine ? 'rounded-tl-sm' : 'rounded-tr-sm'}
	`;

	return (
		<div className='mb-3'>
			{attachment.fileType === 'image' ? (
				<ChatImage
					chatId={chatId}
					fileKey={attachment.key}
					fileName={attachment.fileName}
					dimensions={attachment.dimensions}
					{...imageConfig}
					className={attachmentClassName}
				/>
			) : (
				<ChatFile
					chatId={chatId}
					fileKey={attachment.key}
					fileName={attachment.fileName}
					size={attachment.size}
					fileType={attachment.fileType}
					mimeType={attachment.mimeType}
					fixedHeight={true}
					className={attachmentClassName}
				/>
			)}
		</div>
	);
};
