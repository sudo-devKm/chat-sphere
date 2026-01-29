import { Schema, model, Types } from 'mongoose';

export interface IChat {
	_id: Types.ObjectId;
	participants: Types.ObjectId[];
	lastMessage?: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
	{
		participants: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
		],
		lastMessage: {
			type: Schema.Types.ObjectId,
			ref: 'Message',
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

// 🔥 Critical index (prevents duplicate chats)
chatSchema.index({ participants: 1 }, { unique: true });

export const Chat = model<IChat>('Chat', chatSchema);
