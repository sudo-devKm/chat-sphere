import z from 'zod';

export const RegisterSchema = z
	.object({
		email: z.email('Email is required').meta({ description: 'Email' }),
		password: z
			.string('Password is required')
			.min(6, 'Password must be 6 character long')
			.meta({ description: 'Password' }),
		username: z.string('Username is required'),
	})
	.strict();

export type RegisterPayload = z.infer<typeof RegisterSchema>;
