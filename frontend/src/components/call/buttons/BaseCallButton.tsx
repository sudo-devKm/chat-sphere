import type { ReactNode } from 'react';

interface BaseCallButtonProps {
	children: ReactNode;
	onClick: () => void;
	disabled?: boolean;
	color: 'red' | 'blue' | 'green' | 'gray';
	size?: 'large' | 'medium';
	label: string;
	isActive?: boolean;
	className?: string;
}

export const BaseCallButton = ({
	children,
	onClick,
	disabled = false,
	color,
	size = 'medium',
	label,
	isActive = false,
	className = '',
}: BaseCallButtonProps) => {
	const getButtonStyles = () => {
		const baseStyles =
			'rounded-full flex items-center justify-center focus:outline-none transition-all duration-200';

		const sizeStyles = size === 'large' ? 'w-20 h-20' : 'w-14 h-14';

		const colorStyles = {
			red: isActive
				? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
				: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
			blue: isActive
				? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
				: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
			green: isActive
				? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
				: 'bg-green-500 hover:bg-green-600 active:bg-green-700',
			gray: isActive
				? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-800'
				: 'bg-gray-600 hover:bg-gray-500 active:bg-gray-700',
		}[color];

		const stateStyles = disabled
			? 'opacity-50 cursor-not-allowed'
			: 'cursor-pointer';

		const borderStyles = 'border-2 border-white/20';

		const shadowStyles = 'shadow-md';

		return `${baseStyles} ${sizeStyles} ${colorStyles} ${stateStyles} ${borderStyles} ${shadowStyles} ${className}`;
	};

	return (
		<div className='flex flex-col items-center'>
			<button
				onClick={onClick}
				disabled={disabled}
				className={getButtonStyles()}
				type='button'
			>
				{children}
			</button>
			<div
				className={`mt-2 text-white font-medium ${size === 'large' ? 'text-sm' : 'text-xs'}`}
			>
				{label}
			</div>
		</div>
	);
};
