import React from 'react';

interface DownloadButtonProps {
	isHovered: boolean;
	downloading?: boolean;
	onClick: (e: React.MouseEvent) => void;
	className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
	isHovered,
	downloading = false,
	onClick,
	className = '',
}) => {
	return (
		<button
			className={`
        ${className}
        px-3 py-1.5 text-xs font-medium rounded-md
        transition-all duration-200 flex items-center gap-1.5
        group-hover:shadow-sm
        ${
					isHovered
						? 'bg-gray-800 text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
				}
        ${downloading ? 'opacity-75 cursor-not-allowed' : ''}
      `}
			onClick={onClick}
			disabled={downloading}
			aria-label={downloading ? 'Downloading...' : 'Download'}
		>
			{downloading ? (
				<>
					<svg
						className='w-3.5 h-3.5 animate-spin'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
						/>
					</svg>
					<span className='hidden sm:inline'>Downloading</span>
				</>
			) : (
				<>
					<svg
						className={`w-3.5 h-3.5 ${isHovered ? 'animate-bounce' : ''}`}
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
						/>
					</svg>
					<span className='hidden sm:inline'>Download</span>
				</>
			)}
		</button>
	);
};
