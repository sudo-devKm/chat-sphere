import { logger } from '@/libs/logger';
import { User } from '@/models/user.model';
import { NextFunction, Request, Response } from 'express';

// @access  Private
export const getAllUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const skip = ((page as number) - 1) * +limit;

		const users = await User.find({ _id: { $ne: req.user._id } })
			.select('-password -refreshTokens')
			.skip(skip)
			.limit(+limit)
			.sort({ createdAt: -1 });

		const total = await User.countDocuments({ _id: { $ne: req.user._id } });

		res.json({
			success: true,
			users,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / +limit),
			},
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(req.params.id).select(
			'-password -refreshTokens'
		);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.json({
			success: true,
			user,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { username, avatar, status } = req.body;

		const updateData: any = {};
		if (username) updateData.username = username;
		if (avatar) updateData.avatar = avatar;
		if (status) updateData.status = status;

		const user = await User.findByIdAndUpdate(req.user._id, updateData, {
			new: true,
			runValidators: true,
		}).select('-password -refreshTokens');

		logger.info(`User profile updated: ${user?.email}`);

		res.json({
			success: true,
			user,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.params.id;

		// Users can only delete their own account
		if (userId !== req.user._id.toString()) {
			return res
				.status(403)
				.json({ message: 'Not authorized to delete this user' });
		}

		await User.findByIdAndDelete(userId);

		logger.info(`User deleted: ${req.user.email}`);

		res.json({
			success: true,
			message: 'User deleted successfully',
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
export const searchUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { q } = req.query;

		if (!q) {
			return res.status(400).json({ message: 'Search query required' });
		}

		const users = await User.find({
			$and: [
				{ _id: { $ne: req.user._id } },
				{
					$or: [
						{ username: { $regex: q, $options: 'i' } },
						{ email: { $regex: q, $options: 'i' } },
					],
				},
			],
		} as any)
			.select('-password -refreshTokens')
			.limit(20);

		res.json({
			success: true,
			users,
		});
	} catch (error) {
		next(error);
	}
};
