import type { ReactNode } from 'react';

interface BaseButtonProps {
	children: ReactNode;
	onClick: () => void;
	disabled?: boolean;
	color: 'red' | 'blue' | 'green' | 'gray';
	size: 'lg' | 'md' | 'sm';
	label: string;
	className?: string;
}

export const BaseButton = ({
	children,
	onClick,
	disabled = false,
	color,
	size,
	label,
	className = '',
}: BaseButtonProps) => {
	const getSizeStyles = () => {
		switch (size) {
			case 'lg':
				return 'w-16 h-16';
			case 'md':
				return 'w-14 h-14';
			case 'sm':
				return 'w-12 h-12';
			default:
				return 'w-14 h-14';
		}
	};

	const getColorStyles = () => {
		const colors = {
			red: 'bg-red-600 hover:bg-red-700 active:bg-red-800',
			blue: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
			green: 'bg-green-600 hover:bg-green-700 active:bg-green-800',
			gray: 'bg-gray-700 hover:bg-gray-600 active:bg-gray-800',
		};
		return colors[color];
	};

	const getIconSize = () => {
		switch (size) {
			case 'lg':
				return 'w-8 h-8';
			case 'md':
				return 'w-7 h-7';
			case 'sm':
				return 'w-6 h-6';
			default:
				return 'w-7 h-7';
		}
	};

	const getLabelSize = () => {
		switch (size) {
			case 'lg':
				return 'text-sm';
			case 'md':
				return 'text-xs';
			case 'sm':
				return 'text-xs';
			default:
				return 'text-xs';
		}
	};

	return (
		<div className='flex flex-col items-center'>
			<button
				onClick={onClick}
				disabled={disabled}
				className={`
					${getSizeStyles()}
					${getColorStyles()}
					rounded-full
					flex items-center justify-center
					text-white
					disabled:opacity-50 disabled:cursor-not-allowed
					focus:outline-none
					transition-colors duration-200
					border-2 border-white/20
					shadow-lg
					${className}
				`}
				type='button'
			>
				<div className={getIconSize()}>{children}</div>
			</button>
			<div className={`mt-2 font-medium text-white ${getLabelSize()}`}>
				{label}
			</div>
		</div>
	);
};
