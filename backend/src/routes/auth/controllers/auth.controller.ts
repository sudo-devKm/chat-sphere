import { NextFunction, Request, Response } from 'express';
import { RegisterPayload } from './../validation/register.validation';
import { User } from '@/models/user.model';
import { HttpException } from '@/exceptions/http.exception';
import { StatusCodes } from 'http-status-codes';
import { createJwtToken, sendResponse } from '@/utils/common.util';
import { AUTH_COOKIE_HEADER } from '@/constants/header.constants';
import { envs } from '@/config/env.validate';
import { add } from 'date-fns';
import { LogInPayload } from './../validation/login.validation';

class AuthController {
	constructor() {}

	private readonly setCookie = (response: Response, authToken: string) => {
		response.cookie(AUTH_COOKIE_HEADER, authToken, {
			httpOnly: true,
			secure: envs.isProduction,
			expires: add(new Date(), { days: 1 }),
			maxAge: 1000 * 60 * 60 * 24,
			...(envs.isProduction && { sameSite: 'none' }),
		});
	};

	readonly register = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const registerData: RegisterPayload = req.body;
			// check for same email user
			const emailUser = await User.findOne({ email: registerData.email });
			// if email user exists then throw error.
			if (emailUser) {
				throw new HttpException({
					message: 'Email already Exists',
					status: StatusCodes.BAD_REQUEST,
				});
			}
			// create user model
			const user = new User(registerData);
			// save model
			const savedUser = await user.save();
			// save inserted user.
			const insertedUser = await User.findById(savedUser._id);
			// create token.
			const authToken = createJwtToken({
				_id: savedUser._id.toString(),
				email: savedUser.email,
			});
			// set cookie
			this.setCookie(res, authToken);
			// send response.
			return sendResponse({
				res,
				data: insertedUser?.toJSON?.(),
				message: 'User Registered Successfully',
			});
		} catch (err) {
			return next(err);
		}
	};

	readonly login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const loginPayload: LogInPayload = req.body;
			// check user.
			const user = await User.findOne({ email: loginPayload.email }).select(
				'+password',
			);
			// if user not exists then throw error
			if (!user) {
				throw new HttpException({
					message: 'User is not exists',
					status: StatusCodes.NOT_FOUND,
				});
			}
			// check password.
			const isSamePassword = await user.comparePassword(loginPayload.password);
			// if password is not correct then throw error.
			if (!isSamePassword) {
				throw new HttpException({
					message: 'Invalid credentials',
					status: StatusCodes.BAD_REQUEST,
				});
			}
			// create token.
			const authToken = createJwtToken({
				_id: user._id.toString(),
				email: user.email,
			});
			// set cookie
			this.setCookie(res, authToken);
			// send response
			return sendResponse({ res, message: 'User Logged in successful' });
		} catch (err) {
			return next(err);
		}
	};

	readonly logout = (req: Request, res: Response, next: NextFunction) => {
		try {
			// clear cookie
			res.clearCookie(AUTH_COOKIE_HEADER);
			// send response
			return sendResponse({ res, message: 'User logged out successfully' });
		} catch (err) {
			return next(err);
		}
	};

	readonly getCurrentUser = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			// send response.
			return sendResponse({
				res,
				data: req.user,
				message: 'Current user details fetched successfully',
			});
		} catch (err) {
			return next(err);
		}
	};
}

export default new AuthController();
