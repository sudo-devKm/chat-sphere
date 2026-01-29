import z from 'zod';

export const GetMessagesParamsSchema = z
	.object({
		chatId: z.string(),
		page: z.coerce.number().int().positive().optional(),
		limit: z.coerce.number().int().positive().optional(),
	})
	.strict();
