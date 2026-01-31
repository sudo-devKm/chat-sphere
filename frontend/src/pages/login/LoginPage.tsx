import {
	Button,
	TextField,
	Stack,
	Typography,
	Box,
	InputAdornment,
	IconButton,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, useNavigate } from 'react-router';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';

import { LoginSchema } from '@/schemas/login.schema';
import type { LoginFormValues } from '@/types/auth.types';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useLogin } from '@/hooks/useLogin';

export const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: yupResolver(LoginSchema),
		mode: 'onBlur',
	});

	const { login } = useLogin();

	const onSubmit = async (data: LoginFormValues) => {
		const success = await login(data);
		if (success) {
			navigate('/dashboard');
		}
	};

	return (
		<AuthLayout
			title='Welcome back to ChatSphere'
			subtitle='Sign in to continue your conversations'
		>
			<Box sx={{ mb: 4, textAlign: 'center' }}>
				<Button
					component={RouterLink}
					to='/'
					startIcon={<Home size={18} />}
					sx={{
						color: 'text.secondary',
						textTransform: 'none',
						fontSize: '0.875rem',
						fontWeight: 500,
						mb: 2,
						'&:hover': {
							color: 'primary.main',
							backgroundColor: 'primary.50',
						},
					}}
				>
					Back to Home
				</Button>
			</Box>

			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<Stack spacing={3}>
					<TextField
						label='Email Address'
						type='email'
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
								transition: 'all 0.2s ease',
								'&:hover fieldset': {
									borderColor: 'primary.main',
									borderWidth: '2px',
								},
								'&.Mui-focused fieldset': {
									borderColor: 'primary.main',
									borderWidth: '2px',
								},
							},
						}}
					/>

					<TextField
						label='Password'
						type={showPassword ? 'text' : 'password'}
						fullWidth
						{...register('password')}
						error={!!errors.password}
						helperText={errors.password?.message}
						placeholder='Enter your password'
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<Lock size={20} />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										onClick={() => setShowPassword(!showPassword)}
										edge='end'
										size='small'
										aria-label='toggle password visibility'
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</IconButton>
								</InputAdornment>
							),
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
								transition: 'all 0.2s ease',
								'&:hover fieldset': {
									borderColor: 'primary.main',
									borderWidth: '2px',
								},
								'&.Mui-focused fieldset': {
									borderColor: 'primary.main',
									borderWidth: '2px',
								},
							},
						}}
					/>

					<Button
						type='submit'
						variant='contained'
						size='large'
						disabled={isSubmitting}
						sx={{
							py: 1.5,
							borderRadius: 2,
							fontSize: '1rem',
							fontWeight: 600,
							textTransform: 'none',
							background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
							boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
							transition: 'all 0.3s ease',
							'&:hover': {
								background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
								boxShadow: '0 6px 20px 0 rgba(59, 130, 246, 0.35)',
								transform: 'translateY(-1px)',
							},
							'&:disabled': {
								background: 'grey.300',
								boxShadow: 'none',
							},
						}}
					>
						{isSubmitting ? 'Signing in...' : 'Sign In'}
					</Button>

					<Box textAlign='center' sx={{ pt: 2 }}>
						<Typography variant='body2' sx={{ color: 'text.secondary', mb: 1 }}>
							Don't have an account?
						</Typography>
						<Button
							component={RouterLink}
							to='/register'
							variant='outlined'
							sx={{
								textTransform: 'none',
								fontWeight: 600,
								borderRadius: 2,
								px: 3,
								borderColor: 'primary.main',
								color: 'primary.main',
								'&:hover': {
									borderColor: 'primary.dark',
									backgroundColor: 'primary.50',
								},
							}}
						>
							Create Account
						</Button>
					</Box>
				</Stack>
			</form>
		</AuthLayout>
	);
};
