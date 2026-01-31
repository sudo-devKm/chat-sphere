export interface ImageDimensions {
	width: number;
	height: number;
	aspectRatio?: number;
}

export interface MessageAttachment {
	key: string;
	fileUrl: string;
	fileName: string;
	fileType: 'image' | 'file';
	mimeType: string;
	size: number;
	dimensions?: ImageDimensions; // Now available from backend
}

export const isImageMessage = (message: {
	type: string;
	attachment?: MessageAttachment;
}): boolean =>
	message.type === 'image' || message.attachment?.fileType === 'image';

export const getMessageDimensions = (message: {
	attachment?: MessageAttachment;
}): ImageDimensions | undefined => message.attachment?.dimensions;

export interface MessageProps {
	currentUserId: string;
	chatId: string;
	style?: React.CSSProperties;
	index: number;
}

export interface MessageItem {
	_id: string;
	content: string;
	senderId: string;
	createdAt: string;
	attachment?: MessageAttachment;
}

export interface BubbleProps {
	isMine: boolean;
	children: React.ReactNode;
}

export interface AttachmentProps {
	chatId: string;
	attachment: MessageAttachment;
	isMine: boolean;
}

export interface TextProps {
	content: string;
}

export interface TimeProps {
	time: string;
	isMine: boolean;
}

export interface MessageInputProps {
	userId: string;
	chatId: string;
}

export interface FilePreviewProps {
	file: File;
	onRemove: () => void;
}

export interface UploadProgressProps {
	progress: number;
}

export interface InputAreaProps {
	message: string;
	setMessage: (message: string) => void;
	showEmoji: boolean;
	setShowEmoji: (show: boolean) => void;
	uploading: boolean;
	selectedFile: File | null;
	onSend: () => void;
	onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onEmojiClick: (emoji: string) => void;
	emojiBtnRef: React.RefObject<HTMLButtonElement | null>;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface EmojiPickerPopoverProps {
	open: boolean;
	anchorEl: HTMLButtonElement | null;
	onClose: () => void;
	onEmojiClick: (emoji: string) => void;
}
