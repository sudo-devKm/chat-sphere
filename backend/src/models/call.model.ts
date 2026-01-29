import mongoose, {
	model,
	Schema,
	InferSchemaType,
	HydratedDocument,
} from 'mongoose';

const callSchema = new Schema(
	{
		caller: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		callType: {
			type: String,
			enum: ['audio', 'video'],
			required: true,
		},
		status: {
			type: String,
			enum: [
				'initiated',
				'ringing',
				'active',
				'ended',
				'missed',
				'rejected',
				'failed',
			],
			default: 'initiated',
		},
		startTime: {
			type: Date,
			default: Date.now,
		},
		endTime: {
			type: Date,
		},
		duration: {
			type: Number, // in seconds
			default: 0,
		},
		quality: {
			type: String,
			enum: ['excellent', 'good', 'fair', 'poor'],
			default: 'good',
		},
		metadata: {
			iceServers: [String],
			codecs: [String],
			bandwidth: Number,
			packetLoss: Number,
		},
	},
	{
		timestamps: true,
		collection: 'calls',
	}
);

// Indexes
callSchema.index({ caller: 1, createdAt: -1 });
callSchema.index({ receiver: 1, createdAt: -1 });
callSchema.index({ status: 1 });

// Calculate duration before saving
callSchema.pre('save', function () {
	if (this.endTime && this.startTime) {
		this.duration = Math.floor(
			(new Date(this.endTime).getTime() - new Date(this.startTime).getTime()) /
				1000
		);
	}
});

// Virtual for formatted duration
callSchema.virtual('formattedDuration').get(function () {
	const hours = Math.floor(this.duration / 3600);
	const minutes = Math.floor((this.duration % 3600) / 60);
	const seconds = this.duration % 60;

	if (hours > 0) {
		return `${hours}h ${minutes}m ${seconds}s`;
	} else if (minutes > 0) {
		return `${minutes}m ${seconds}s`;
	} else {
		return `${seconds}s`;
	}
});

export type CallDocument = HydratedDocument<typeof callSchema>;

export type ICall = InferSchemaType<typeof callSchema>;

export const Call = model<ICall>('Call', callSchema);
