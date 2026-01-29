// types/message.types.ts
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
