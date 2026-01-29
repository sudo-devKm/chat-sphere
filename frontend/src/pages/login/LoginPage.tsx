import { Button, TextField, Stack, Typography, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, redirect } from 'react-router';

import { LoginSchema } from '@/schemas/login.schema';
import type { LoginFormValues } from '@/types/auth.types';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useLogin } from '@/hooks/useLogin';

export const LoginPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: yupResolver(LoginSchema),
	});

	const { login } = useLogin();

	const onSubmit = async (data: LoginFormValues) => {
		const success = await login(data);
		if (success) {
			redirect('/dashboard');
		}
	};

	return (
		<AuthLayout title='Welcome back'>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<Stack spacing={2}>
					<TextField
						label='Email'
						fullWidth
						{...register('email')}
						error={!!errors.email}
						helperText={errors.email?.message}
					/>

					<TextField
						label='Password'
						type='password'
						fullWidth
						{...register('password')}
						error={!!errors.password}
						helperText={errors.password?.message}
					/>

					<Button
						type='submit'
						variant='contained'
						size='large'
						disabled={isSubmitting}
					>
						Login
					</Button>

					<Box textAlign='center'>
						<Typography variant='body2'>
							Don’t have an account?{' '}
							<Button component={RouterLink} to='/register' size='small'>
								Register
							</Button>
						</Typography>
					</Box>
				</Stack>
			</form>
		</AuthLayout>
	);
};
