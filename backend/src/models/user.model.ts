import { Model, model, Types, Schema } from 'mongoose';
import { randomBytes } from 'node:crypto';
import argon2 from 'argon2';

export interface IUser {
	_id: Types.ObjectId;
	email: string;
	password: string;
	username: string;
	status?: string;
	isActive?: boolean;
	lastSeen?: number;
	socketId?: string;
	avatar?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IUserMethods {
	comparePassword(candidatePassword: string): Promise<boolean>;
	updateLastSeen(): Promise<IUser>;
}

const userSchema = new Schema<IUser, Model<IUser, any, any, any>, IUserMethods>(
	{
		username: {
			type: String,
			required: [true, 'Username is required'],
			unique: true,
			trim: true,
			minlength: [3, 'Username must be at least 3 characters'],
			maxlength: [30, 'Username cannot exceed 30 characters'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				'Please provide a valid email',
			],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [6, 'Password must be at least 6 characters'],
			select: false,
		},
		avatar: {
			type: String,
			default: '',
		},
		status: {
			type: String,
			enum: ['online', 'offline', 'busy', 'away'],
			default: 'offline',
		},
		socketId: {
			type: String,
			default: null,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		lastSeen: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		collection: 'users',
	},
);

// Indexes for performance
userSchema.index({ status: 1 });

// Hash password before saving
userSchema.pre('save', async function () {
	if (this.isModified('password')) {
		const salt = randomBytes(16);
		this.password = await argon2.hash(this.password, { salt });
	}
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (
	candidatePassword: string,
): Promise<boolean> {
	return argon2.verify(this.password, candidatePassword);
};

// Update last seen
userSchema.methods.updateLastSeen = function () {
	this.lastSeen = Date.now();
	return this.save();
};

export const User = model<typeof userSchema>('User', userSchema);
