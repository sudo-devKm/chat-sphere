import React, { useState, useMemo } from 'react';
import { useS3PrivateFile } from '@/hooks/useS3PrivateFile';
import { getFileTypeConfig } from '@/constants/fileTypes.constant';
import { ChatFileSkeleton } from './ChatFileSkeleton';
import { FileIcon } from '@/components/file/FileIcon';
import { FileInfo } from '@/components/file/FileInfo';
import { DownloadButton } from '@/components/file/DownloadButton';
import { formatFileSize } from '@/utils/file.utils';

type ChatFileProps = {
	chatId: string;
	fileKey: string;
	fileName: string;
	size: number;
	fileType?: 'image' | 'file';
	mimeType?: string;
	className?: string;
	fixedHeight?: boolean;
	skeletonOnly?: boolean;
	onDownloadStart?: () => void;
	onDownloadComplete?: () => void;
	onDownloadError?: (error: Error) => void;
};

export const ChatFile: React.FC<ChatFileProps> = ({
	chatId,
	fileKey,
	fileName,
	size,
	className = '',
	fixedHeight = true,
	skeletonOnly = false,
	onDownloadStart,
	onDownloadComplete,
	onDownloadError,
}) => {
	const { loading, download, previewUrl } = useS3PrivateFile({
		chatId,
		fileKey,
		autoLoad: false,
	});

	const [isHovered, setIsHovered] = useState(false);
	const [downloading, setDownloading] = useState(false);

	// Get file configuration
	const fileConfig = useMemo(() => {
		const extension = fileName.split('.').pop()?.toLowerCase() || '';
		return getFileTypeConfig(extension);
	}, [fileName]);

	// Get color classes
	const colorClasses = useMemo(() => {
		return `${fileConfig.bgColor} ${fileConfig.borderColor} ${fileConfig.textColor}`;
	}, [fileConfig]);

	// Handle download with callbacks
	const handleDownload = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			setDownloading(true);
			onDownloadStart?.();

			await download();

			setDownloading(false);
			onDownloadComplete?.();
		} catch (error) {
			console.error('Download failed:', error);
			setDownloading(false);
			onDownloadError?.(error as Error);
		}
	};

	// Determine if we're in loading/downloading state
	const isLoadingState = loading || downloading;

	// Skeleton loading state
	if (isLoadingState || skeletonOnly) {
		return <ChatFileSkeleton className={className} fixedHeight={fixedHeight} />;
	}

	return (
		<div
			onClick={handleDownload}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={`
        ${className}
        ${colorClasses}
        flex items-center gap-3 rounded-lg border p-3
        ${fixedHeight ? 'min-h-16' : ''}
        transition-all duration-200 cursor-pointer
        hover:shadow-md active:scale-[0.98] group
        ${isHovered ? 'border-opacity-100 scale-[1.01]' : 'border-opacity-60'}
        relative overflow-hidden
      `}
			style={{ minHeight: fixedHeight ? '4rem' : undefined }}
			role='button'
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					handleDownload(e as any);
				}
			}}
			aria-label={`Download ${fileName} (${formatFileSize(size)})`}
		>
			{/* File Icon */}
			<FileIcon fileName={fileName} isHovered={isHovered} />

			{/* File Info */}
			<FileInfo fileName={fileName} size={size} />

			{/* Download Button */}
			<div className='shrink-0'>
				<DownloadButton
					isHovered={isHovered}
					downloading={downloading}
					onClick={handleDownload}
				/>
			</div>

			{/* Download progress indicator */}
			{downloading && (
				<div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200'>
					<div className='h-full bg-blue-500 animate-pulse' />
				</div>
			)}

			{/* Preview availability indicator */}
			{previewUrl && (
				<div className='absolute top-1.5 right-1.5'>
					<span className='text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200'>
						Preview
					</span>
				</div>
			)}
		</div>
	);
};
