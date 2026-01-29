import * as yup from 'yup';

export class EnvValidationError extends Error {
	constructor(public details: string[]) {
		super('Invalid environment configuration');
	}
}

const envSchema = yup.object({
	VITE_API_URL: yup.string().required(),
	VITE_SOCKET_URL: yup.string().required(),
	VITE_SIP_WS_URL: yup.string().required(),
	VITE_APP_PORT: yup.number().required(),
	VITE_APP_NAME: yup.string().optional(),
});

/**
 * Validates env object and throws on failure
 */
export const validateEnv = (env: Record<string, string | undefined>) => {
	try {
		const validateEnvs = envSchema.validateSync(env, {
			abortEarly: false,
			stripUnknown: true,
		});

		return validateEnvs;
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			throw new EnvValidationError(
				error.inner.map((err) => `${err.path}: ${err.message}`),
			);
		}
		throw error;
	}
};

export const envs = (import.meta as any).env;
