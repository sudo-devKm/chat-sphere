import { Button, type ButtonProps } from '@mui/material';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { type ReactNode, forwardRef } from 'react';

interface CtaButtonProps extends Omit<ButtonProps, 'component'> {
	to?: string;
	variant?: 'contained' | 'outlined' | 'text';
	children: ReactNode;
	withArrow?: boolean;
}

// Create a wrapper for React Router Link to work with Material UI
const RouterLink = forwardRef<HTMLAnchorElement, any>((props, ref) => {
	const { href, ...other } = props;
	// Map href (Material UI) to to (React Router)
	return <Link ref={ref} to={href} {...other} />;
});

RouterLink.displayName = 'RouterLink';

export const CtaButton = ({
	to,
	variant = 'contained',
	children,
	withArrow = false,
	className = '',
	...props
}: CtaButtonProps) => {
	const buttonContent = (
		<span className='flex items-center justify-center'>
			{children}
			{withArrow && <ArrowRight className='ml-2 size-4' />}
		</span>
	);

	const buttonClasses = `
    ${
			variant === 'contained'
				? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
				: ''
		}
    ${className}
  `;

	if (to) {
		return (
			<Button
				component={RouterLink}
				href={to}
				variant={variant}
				size='large'
				className={buttonClasses}
				sx={{
					borderRadius: '9999px',
					padding: '12px 24px',
					fontWeight: 600,
					textTransform: 'none',
					transition: 'all 0.3s ease',
					...(variant === 'contained' && {
						'&:hover': {
							transform: 'translateY(-2px)',
						},
					}),
					...(variant === 'outlined' && {
						borderWidth: 2,
						'&:hover': {
							backgroundColor: 'rgba(0, 0, 0, 0.04)',
						},
					}),
				}}
				{...props}
			>
				{buttonContent}
			</Button>
		);
	}

	return (
		<Button
			variant={variant}
			size='large'
			className={buttonClasses}
			sx={{
				borderRadius: '9999px',
				padding: '12px 24px',
				fontWeight: 600,
				textTransform: 'none',
				transition: 'all 0.3s ease',
				...(variant === 'contained' && {
					'&:hover': {
						transform: 'translateY(-2px)',
					},
				}),
			}}
			{...props}
		>
			{buttonContent}
		</Button>
	);
};
