// src/pages/RegisterPage.tsx
import { useForm } from 'react-hook-form';
import { Link as RouterLink, redirect } from 'react-router';
import { AuthLayout } from '@/layouts/AuthLayout';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	Stack,
	TextField,
	Typography,
	Box,
	InputAdornment,
} from '@mui/material';
import { User, Mail, Lock } from 'lucide-react';

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
				<Stack spacing={3}>
					{/* Username Field */}
					<TextField
						label='Username'
						fullWidth
						{...register('username')}
						error={!!errors.username}
						helperText={errors.username?.message}
						placeholder='Enter your username'
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<User size={20} />
								</InputAdornment>
							),
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
							},
						}}
					/>

					{/* Email Field */}
					<TextField
						label='Email Address'
						fullWidth
						{...register('email')}
						error={!!errors.email}
						helperText={errors.email?.message}
						placeholder='you@example.com'
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<Mail size={20} />
								</InputAdornment>
							),
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
							},
						}}
					/>

					{/* Password Field */}
					<TextField
						label='Password'
						type='password'
						fullWidth
						{...register('password')}
						error={!!errors.password}
						helperText={errors.password?.message}
						placeholder='Create a secure password'
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<Lock size={20} />
								</InputAdornment>
							),
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
							},
						}}
					/>

					{/* Confirm Password Field */}
					<TextField
						label='Confirm Password'
						type='password'
						fullWidth
						{...register('confirmPassword')}
						error={!!errors.confirmPassword}
						helperText={errors.confirmPassword?.message}
						placeholder='Re-enter your password'
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<Lock size={20} />
								</InputAdornment>
							),
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
							},
						}}
					/>

					{/* Submit Button */}
					<Button
						type='submit'
						variant='contained'
						size='large'
						disabled={isSubmitting}
						sx={{
							borderRadius: 2,
							py: 1.5,
							fontWeight: 600,
							fontSize: '1rem',
							background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
							'&:hover': {
								background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
							},
						}}
					>
						{isSubmitting ? 'Creating...' : 'Create Account'}
					</Button>

					{/* Login Redirect */}
					<Box
						textAlign='center'
						sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}
					>
						<Typography variant='body2' sx={{ color: 'text.secondary', mb: 1 }}>
							Already have an account?
						</Typography>
						<Button
							component={RouterLink}
							to='/login'
							sx={{
								color: 'primary.main',
								textTransform: 'none',
								fontWeight: 600,
							}}
						>
							Sign In
						</Button>
					</Box>
				</Stack>
			</form>
		</AuthLayout>
	);
};
