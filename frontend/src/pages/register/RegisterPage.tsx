import { useForm } from 'react-hook-form';
import { Link as RouterLink, redirect } from 'react-router';
import { AuthLayout } from '@/layouts/AuthLayout';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography, Box } from '@mui/material';

import { RegisterSchema } from '@/schemas/register.schema';
import type { RegisterFormsValues } from '@/types/auth.types';
import { useRegister } from '@/hooks/useRegister';

export const RegisterPage: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormsValues>({
		resolver: yupResolver(RegisterSchema),
	});

	const { register: userRegister } = useRegister();

	const onSubmit = async (data: RegisterFormsValues) => {
		const success = await userRegister({
			email: data.email,
			password: data.password,
			username: data.username,
		});

		if (success) {
			redirect('/dashboard');
		}
	};

	return (
		<AuthLayout title='Create your account'>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<Stack spacing={2}>
					<TextField
						label='User Name'
						fullWidth
						{...register('username')}
						error={!!errors.username}
						helperText={errors.username?.message}
					/>

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

					<TextField
						label='Confirm Password'
						type='password'
						fullWidth
						{...register('confirmPassword')}
						error={!!errors.confirmPassword}
						helperText={errors.confirmPassword?.message}
					/>

					<Button
						type='submit'
						variant='contained'
						size='large'
						disabled={isSubmitting}
					>
						Register
					</Button>

					{/* 🔗 LOGIN REDIRECT */}
					<Box textAlign='center'>
						<Typography variant='body2'>
							Already have an account?{' '}
							<Button component={RouterLink} to='/login' size='small'>
								Login
							</Button>
						</Typography>
					</Box>
				</Stack>
			</form>
		</AuthLayout>
	);
};
