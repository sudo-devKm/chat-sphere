// components/FileIcon.tsx
import React from 'react';
import { getFileTypeConfig } from '@/constants/fileTypes.constant';
import { getFileExtension } from '@/utils/file.utils';

interface FileIconProps {
	fileName: string;
	className?: string;
	showExtensionBadge?: boolean;
	isHovered?: boolean;
}

export const FileIcon: React.FC<FileIconProps> = ({
	fileName,
	className = '',
	showExtensionBadge = true,
	isHovered = false,
}) => {
	const extension = fileName.split('.').pop()?.toLowerCase() || '';
	const fileConfig = getFileTypeConfig(extension);
	const fileExtension = getFileExtension(fileName)
		.toUpperCase()
		.replace('.', '');

	return (
		<div className='relative shrink-0'>
			<div
				className={`
        w-10 h-10 rounded-lg flex items-center justify-center text-xl
        ${isHovered ? 'scale-110' : ''}
        transition-transform duration-200
        ${fileConfig.iconColor}
        ${className}
      `}
			>
				{fileConfig.icon}
			</div>

			{showExtensionBadge && fileExtension && (
				<div className='absolute -bottom-1 -right-1'>
					<span className='text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/90 text-gray-700 border border-gray-300'>
						{fileExtension}
					</span>
				</div>
			)}
		</div>
	);
};
