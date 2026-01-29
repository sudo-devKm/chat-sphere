import { core, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { REQUEST_ID_HEADER } from '@/constants/header.constants';
import { ValidateSchemaParams } from '@/types/common.types';
import { NextFunction, Request, Response } from 'express';

const extractZodErrors = (errors: PromiseRejectedResult[]) => {
	const messages: string[] = [];
	const detailedErrors: {
		cause: unknown;
		issues: core.$ZodIssue[];
	}[] = [];
	errors.forEach(({ reason }: { reason: { err: ZodError; key: string } }) => {
		const { err } = reason;
		messages.push(...err.issues.map((issue) => issue.message));
		detailedErrors.push({
			issues: err.issues,
			cause: err.cause,
		});
	});

	return { messages, detailedErrors };
};

export const validateSchemaMiddleware = (params: ValidateSchemaParams) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const zodSchemaResp = await Promise.allSettled(
				Object.keys(params).map((key: string) => {
					const { schema, params: options } = params[key]!;
					return schema
						.parseAsync((req as Record<string, any>)[key], options ?? {})
						.catch((err: ZodError) => {
							throw { err, key };
						});
				}),
			);

			const errors = zodSchemaResp.filter(
				(result) => result.status === 'rejected',
			);

			if (errors.length) {
				const { detailedErrors, messages } = extractZodErrors(errors);
				return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
					messages,
					details: detailedErrors,
					success: false,
					requestId: res.getHeader(REQUEST_ID_HEADER),
					message: 'Payload Validation Failed',
				});
			}

			return next();
		} catch (err) {
			return next(err);
		}
	};
};
