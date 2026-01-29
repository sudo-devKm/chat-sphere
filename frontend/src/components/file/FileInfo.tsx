import React from 'react';
import { getFileTypeConfig } from '@/constants/fileTypes.constant';
import { truncateFileName, formatFileSize } from '@/utils/file.utils';

interface FileInfoProps {
	fileName: string;
	size: number;
	className?: string;
}

export const FileInfo: React.FC<FileInfoProps> = ({
	fileName,
	size,
	className = '',
}) => {
	const extension = fileName.split('.').pop()?.toLowerCase() || '';
	const fileConfig = getFileTypeConfig(extension);
	const displayFileName = truncateFileName(fileName);
	const formattedSize = formatFileSize(size);

	return (
		<div className={`flex flex-col grow min-w-0 ${className}`}>
			<span className='text-sm font-medium truncate' title={fileName}>
				{displayFileName}
			</span>
			<div className='flex items-center gap-2 mt-0.5'>
				<span className='text-xs opacity-75'>{formattedSize}</span>
				<span className='text-[10px] opacity-50'>•</span>
				<span className='text-[10px] opacity-75 capitalize'>
					{fileConfig.label}
				</span>
			</div>
		</div>
	);
};
