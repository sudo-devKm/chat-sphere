import { Response, Router } from 'express';
import { core, ZodObject } from 'zod';

export interface AppRoute {
	router: Router;
	path?: string;
}

export type ValidateSchemaItem = {
	schema: ZodObject;
	params?: core.ParseContext<core.$ZodIssue>;
};

export type ValidateSchemaParams = {
	[key: string]: ValidateSchemaItem;
};

export type CommonResponseParams = {
	status?: number;
	data?: Record<string, any> | null | undefined;
	success?: boolean;
	message?: string;
};

export type SendResponseParams = CommonResponseParams & {
	res: Response;
};

export type HttpExceptionPrams = CommonResponseParams;
