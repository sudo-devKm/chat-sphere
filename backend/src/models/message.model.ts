import { Schema, model, Types } from 'mongoose';

export enum MessageType {
	TEXT = 'text',
	IMAGE = 'image',
	FILE = 'file',
}

export enum MessageStatus {
	SENT = 'sent',
	DELIVERED = 'delivered',
	READ = 'read',
}

// Add dimensions interface
export interface IImageDimensions {
	width: number;
	height: number;
	aspectRatio?: number;
}

export interface IMessageAttachment {
	key: string;
	fileUrl: string;
	fileName: string;
	fileType: MessageType.IMAGE | MessageType.FILE;
	mimeType: string;
	size: number;
	dimensions?: IImageDimensions;
}

export interface IMessage {
	_id: Types.ObjectId;
	chatId: Types.ObjectId;
	senderId: Types.ObjectId;
	receiverId: Types.ObjectId;
	content?: string;
	type: MessageType;
	attachment?: IMessageAttachment;
	status: MessageStatus;
	createdAt: Date;
	updatedAt: Date;
}

const ImageDimensionsSchema = new Schema(
	{
		width: {
			type: Number,
			required: true,
			min: 1,
		},
		height: {
			type: Number,
			required: true,
			min: 1,
		},
		aspectRatio: {
			type: Number,
			default: (doc: IImageDimensions) => {
				// Auto-calculate aspect ratio
				if (doc.width && doc.height) {
					return parseFloat((doc.width / doc.height).toFixed(3));
				}
				return null;
			},
		},
	},
	{ _id: false },
);

const MessageAttachmentSchema = new Schema(
	{
		key: { type: String, required: true },
		fileUrl: { type: String, required: true },
		fileName: { type: String, required: true },
		fileType: {
			type: String,
			enum: [MessageType.IMAGE, MessageType.FILE],
			required: true,
		},
		mimeType: { type: String, required: true },
		size: {
			type: Number,
			required: true,
			min: 1,
		},
		dimensions: {
			type: ImageDimensionsSchema,
			required: function () {
				// Required only for images
				return this.fileType === MessageType.IMAGE;
			},
			validate: {
				validator: function (value: any) {
					// Only validate if it's an image
					if (this.fileType !== MessageType.IMAGE) return true;

					// Check if dimensions exist and are valid
					if (!value) return false;
					if (!value.width || !value.height) return false;
					if (value.width <= 0 || value.height <= 0) return false;

					return true;
				},
				message: 'Dimensions are required and must be positive for images',
			},
		},
	},
	{ _id: false },
);

const messageSchema = new Schema<IMessage>(
	{
		chatId: {
			type: Schema.Types.ObjectId,
			ref: 'Chat',
			required: true,
			index: true,
		},
		senderId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		receiverId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		content: {
			type: String,
			trim: true,
			default: '',
		},
		attachment: {
			type: MessageAttachmentSchema,
			required: false,
		},
		type: {
			type: String,
			enum: Object.values(MessageType),
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(MessageStatus),
			default: MessageStatus.SENT,
			index: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, status: 1 });
messageSchema.index({ chatId: 1, type: 1 });

// Add index for image dimensions queries if needed
messageSchema.index({
	'attachment.fileType': 1,
	'attachment.dimensions.width': 1,
	'attachment.dimensions.height': 1,
});

/* -------------------------------
 Auto-derive message type and validate dimensions
--------------------------------*/
messageSchema.pre('validate', function () {
	// Set message type based on attachment
	if (this.attachment) {
		this.type = this.attachment.fileType;
	} else {
		this.type = MessageType.TEXT;
	}

	// Validate image dimensions if present
	if (this.attachment?.fileType === MessageType.IMAGE) {
		const { dimensions } = this.attachment;

		if (!dimensions) {
			throw new Error('Dimensions are required for image attachments');
		}

		if (dimensions.width <= 0 || dimensions.height <= 0) {
			throw new Error('Image dimensions must be positive numbers');
		}

		// Auto-calculate aspect ratio if not provided
		if (dimensions.width && dimensions.height && !dimensions.aspectRatio) {
			dimensions.aspectRatio = parseFloat(
				(dimensions.width / dimensions.height).toFixed(3),
			);
		}
	}
});

messageSchema.virtual('hasAttachment').get(function () {
	return !!this.attachment;
});

messageSchema.virtual('isImage').get(function () {
	return this.type === MessageType.IMAGE;
});

messageSchema.virtual('isFile').get(function () {
	return this.type === MessageType.FILE;
});

messageSchema.virtual('isText').get(function () {
	return this.type === MessageType.TEXT;
});

messageSchema.virtual('imageSizeCategory').get(function () {
	if (!this.attachment?.dimensions) return null;

	const { width, height } = this.attachment.dimensions;
	const megapixels = (width * height) / 1000000;

	if (megapixels > 12) return 'large';
	if (megapixels > 5) return 'medium';
	return 'small';
});

export const Message = model<IMessage>('Message', messageSchema);
