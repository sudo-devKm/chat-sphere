import { Call } from '@/models/call.model';
import { NextFunction, Request, Response } from 'express';

class CallController {
	constructor() {}

	// @access  Private
	readonly getCallHistory = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 20;
			const skip = (page - 1) * limit;

			const calls = await Call.find({
				$or: [{ caller: req.user._id! }, { receiver: req.user._id }],
			})
				.populate('caller', 'username avatar')
				.populate('receiver', 'username avatar')
				.skip(skip)
				.limit(limit)
				.sort({ createdAt: -1 });

			const total = await Call.countDocuments({
				$or: [{ caller: req.user._id }, { receiver: req.user._id }],
			});

			res.json({
				success: true,
				calls,
				pagination: {
					page,
					limit,
					total,
					pages: Math.ceil(total / limit),
				},
			});
		} catch (error) {
			next(error);
		}
	};

	// @desc    Get call by ID
	// @route   GET /api/calls/:id
	// @access  Private
	readonly getCallById = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const call = await Call.findById(req.params.id)
				.populate('caller', 'username avatar')
				.populate('receiver', 'username avatar');

			if (!call) {
				return res.status(404).json({ message: 'Call not found' });
			}

			// Check authorization
			if (
				call.caller._id.toString() !== req.user._id.toString() &&
				call.receiver._id.toString() !== req.user._id.toString()
			) {
				return res.status(403).json({ message: 'Not authorized' });
			}

			res.json({
				success: true,
				call,
			});
		} catch (error) {
			next(error);
		}
	};

	// @desc    Delete call
	// @route   DELETE /api/calls/:id
	// @access  Private
	readonly deleteCall = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const call = await Call.findById(req.params.id);

			if (!call) {
				return res.status(404).json({ message: 'Call not found' });
			}

			// Check authorization
			if (
				call.caller.toString() !== req.user._id.toString() &&
				call.receiver.toString() !== req.user._id.toString()
			) {
				return res.status(403).json({ message: 'Not authorized' });
			}

			await call.deleteOne();

			res.json({
				success: true,
				message: 'Call deleted successfully',
			});
		} catch (error) {
			next(error);
		}
	};

	// @desc    Get call statistics
	// @route   GET /api/calls/stats
	// @access  Private
	readonly getCallStats = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const stats = await Call.aggregate([
				{
					$match: {
						$or: [{ caller: req.user._id }, { receiver: req.user._id }],
					},
				},
				{
					$group: {
						_id: null,
						totalCalls: { $sum: 1 },
						totalDuration: { $sum: '$duration' },
						videoCalls: {
							$sum: { $cond: [{ $eq: ['$callType', 'video'] }, 1, 0] },
						},
						audioCalls: {
							$sum: { $cond: [{ $eq: ['$callType', 'audio'] }, 1, 0] },
						},
						missedCalls: {
							$sum: { $cond: [{ $eq: ['$status', 'missed'] }, 1, 0] },
						},
						completedCalls: {
							$sum: { $cond: [{ $eq: ['$status', 'ended'] }, 1, 0] },
						},
					},
				},
			]);

			res.json({
				success: true,
				stats: stats[0] || {
					totalCalls: 0,
					totalDuration: 0,
					videoCalls: 0,
					audioCalls: 0,
					missedCalls: 0,
					completedCalls: 0,
				},
			});
		} catch (error) {
			next(error);
		}
	};
}

export default new CallController();
