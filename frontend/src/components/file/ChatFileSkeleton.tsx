import React from 'react';

interface ChatFileSkeletonProps {
	className?: string;
	fixedHeight?: boolean;
}

export const ChatFileSkeleton: React.FC<ChatFileSkeletonProps> = ({
	className = '',
	fixedHeight = true,
}) => {
	return (
		<div
			className={`
        ${className}
        flex items-center gap-3 rounded-lg border p-3
        ${fixedHeight ? 'min-h-16' : ''}
        bg-linear-to-r from-gray-100 to-gray-200 animate-pulse
        overflow-hidden relative
      `}
			style={{ minHeight: fixedHeight ? '4rem' : undefined }}
		>
			{/* Shimmer effect */}
			<div className='absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />

			<div className='w-10 h-10 rounded-md bg-gray-300 shrink-0' />
			<div className='flex flex-col grow space-y-2 min-w-0'>
				<div className='h-3.5 w-3/4 rounded bg-gray-300' />
				<div className='flex items-center gap-2'>
					<div className='h-2.5 w-16 rounded bg-gray-300' />
					<div className='h-2.5 w-12 rounded bg-gray-300' />
				</div>
			</div>
			<div className='w-20 h-8 rounded-md bg-gray-300 shrink-0' />
		</div>
	);
};
