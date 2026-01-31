import { Box, type BoxProps } from '@mui/material';
import { type ReactNode } from 'react';

interface SectionContainerProps extends BoxProps {
	children: ReactNode;
	variant?: 'default' | 'gradient' | 'dark';
}

export const SectionContainer = ({
	children,
	variant = 'default',
	...props
}: SectionContainerProps) => {
	const getBackground = () => {
		switch (variant) {
			case 'gradient':
				return 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)';
			case 'dark':
				return 'grey.900';
			default:
				return 'background.default';
		}
	};

	return (
		<Box
			sx={{
				py: { xs: 8, md: 12 },
				px: { xs: 2, sm: 3 },
				background: getBackground(),
				color: variant === 'dark' ? 'white' : 'text.primary',
				...props.sx,
			}}
			{...props}
		>
			<Box sx={{ maxWidth: '1200px', mx: 'auto' }}>{children}</Box>
		</Box>
	);
};
