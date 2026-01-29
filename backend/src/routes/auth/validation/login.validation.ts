import z from 'zod';
import { RegisterSchema } from './register.validation';

export const LogInSchema = RegisterSchema.pick({
	email: true,
	password: true,
}).strict();

export type LogInPayload = z.infer<typeof LogInSchema>;
