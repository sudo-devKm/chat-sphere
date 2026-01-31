import { type MessageAttachment } from '@/types/message.types';
import { getMessageDimensions } from '@/types/message.types';

export const useImageConfig = (attachment?: MessageAttachment) => {
	if (!attachment || attachment.fileType !== 'image') {
		return {
			maxWidth: 300,
			minHeight: 150,
		};
	}

	const dimensions = getMessageDimensions({ attachment });

	if (!dimensions) {
		return {
			maxWidth: 300,
			minHeight: 150,
		};
	}

	const aspectRatio = dimensions.width / dimensions.height;
	let maxWidth = 300;
	let minHeight = 120;

	if (aspectRatio > 2) {
		maxWidth = 250;
	} else if (aspectRatio < 0.5) {
		maxWidth = 200;
	}

	if (aspectRatio < 1) {
		minHeight = 180;
	}

	return {
		maxWidth,
		minHeight,
	};
};
