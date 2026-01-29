import React, { useState, useEffect, useMemo } from 'react';
import { useS3PrivateFile } from '@/hooks/useS3PrivateFile';
import type { ImageDimensions } from '@/types/message.types';

type ChatImageProps = {
	chatId: string;
	fileKey: string;
	fileName: string;
	// Dimensions from backend
	dimensions?: ImageDimensions;
	// Optional props for better control
	maxWidth?: number; // Maximum display width in pixels
	minHeight?: number; // Minimum height in pixels
	className?: string;
	// Skeleton configuration
	skeletonOnly?: boolean; // Only show skeleton (for list rendering optimization)
	onDimensionsLoaded?: (dimensions: ImageDimensions) => void;
};

export const ChatImage: React.FC<ChatImageProps> = ({
	chatId,
	fileKey,
	fileName,
	dimensions: initialDimensions,
	maxWidth = 400, // Default max width for chat images
	minHeight = 150, // Default min height
	className = '',
	skeletonOnly = false,
	onDimensionsLoaded,
}) => {
	const { previewUrl, loading, download } = useS3PrivateFile({
		chatId,
		fileKey,
		autoLoad: true,
	});

	const [dimensions, setDimensions] = useState(initialDimensions || null);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [imageError, setImageError] = useState(false);
	const [_, setClientDimensions] = useState<ImageDimensions | null>(null);

	// Calculate display dimensions based on maxWidth constraint
	const displayDimensions = useMemo(() => {
		if (!dimensions) {
			// Fallback to default dimensions if none available
			return { width: 200, height: 150, aspectRatio: 4 / 3 };
		}

		let { width, height } = dimensions;
		const aspectRatio = width / height;

		// Scale down if wider than maxWidth
		if (width > maxWidth) {
			const scale = maxWidth / width;
			width = maxWidth;
			height = Math.round(height * scale);
		}

		// Ensure minimum height
		if (height < minHeight) {
			height = minHeight;
			width = Math.round(minHeight * aspectRatio);
		}

		return {
			width: Math.round(width),
			height: Math.round(height),
			aspectRatio,
			originalWidth: dimensions.width,
			originalHeight: dimensions.height,
		};
	}, [dimensions, maxWidth, minHeight]);

	// Calculate skeleton style
	const skeletonStyle = useMemo(() => {
		return {
			width: `${displayDimensions.width}px`,
			height: `${displayDimensions.height}px`,
			maxWidth: `${maxWidth}px`,
			minHeight: `${minHeight}px`,
		};
	}, [displayDimensions, maxWidth, minHeight]);

	// Handle image load success
	const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const img = e.target as HTMLImageElement;

		// Extract actual dimensions from the loaded image
		const actualDimensions = {
			width: img.naturalWidth,
			height: img.naturalHeight,
		};

		// Store client-side extracted dimensions
		setClientDimensions(actualDimensions);

		// If backend dimensions were missing or incorrect, update them
		if (
			!dimensions ||
			dimensions.width !== actualDimensions.width ||
			dimensions.height !== actualDimensions.height
		) {
			setDimensions(actualDimensions);

			// Notify parent about the actual dimensions
			if (onDimensionsLoaded) {
				onDimensionsLoaded(actualDimensions);
			}
		}

		setImageLoaded(true);
		setImageError(false);
	};

	// Handle image load error
	const handleImageError = () => {
		setImageError(true);
		setImageLoaded(false);
	};

	// Reset states when URL changes
	useEffect(() => {
		setImageLoaded(false);
		setImageError(false);
		setClientDimensions(null);
	}, [previewUrl]);

	// Try to extract dimensions from preview URL if backend dimensions are missing
	useEffect(() => {
		if (previewUrl && !dimensions && !loading && !imageError) {
			const img = new Image();

			img.onload = () => {
				const extractedDimensions = {
					width: img.naturalWidth,
					height: img.naturalHeight,
				};
				setDimensions(extractedDimensions);

				// Notify parent about extracted dimensions
				if (onDimensionsLoaded) {
					onDimensionsLoaded(extractedDimensions);
				}
			};

			img.onerror = () => {
				// If extraction fails, use default dimensions
				const defaultDimensions = { width: 200, height: 150 };
				setDimensions(defaultDimensions);
			};

			img.src = previewUrl;
		}
	}, [previewUrl, dimensions, loading, imageError, onDimensionsLoaded]);

	// Determine display states
	const showSkeleton =
		loading || (!imageLoaded && previewUrl && !imageError) || skeletonOnly;
	const showImage = previewUrl && !imageError && imageLoaded;
	const showError = !loading && (imageError || (!previewUrl && !loading));

	// Early return for skeleton-only mode
	if (skeletonOnly) {
		return (
			<div
				className={`relative overflow-hidden rounded-lg ${className}`}
				style={skeletonStyle}
			>
				<div className='absolute inset-0 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse'>
					<div className='absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />
				</div>
			</div>
		);
	}

	return (
		<div
			className={`relative overflow-hidden rounded-lg ${className}`}
			style={skeletonStyle}
		>
			{/* Skeleton with exact dimensions from backend */}
			{showSkeleton && (
				<div className='absolute inset-0 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse'>
					<div className='absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />

					{/* Optional: Show dimension info in skeleton (for debugging) */}
					{dimensions && (
						<div className='absolute bottom-1 right-1'>
							<span className='text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-white'>
								{dimensions.width}×{dimensions.height}
							</span>
						</div>
					)}
				</div>
			)}

			{/* Error State */}
			{showError && (
				<div className='absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4'>
					<div className='w-10 h-10 mb-2 text-gray-400'>
						<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z'
							/>
						</svg>
					</div>
					<p className='text-xs text-gray-500 text-center'>
						Failed to load image
					</p>
					<button
						onClick={download}
						className='mt-2 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors'
					>
						Try Download
					</button>
				</div>
			)}

			{/* Actual Image */}
			{previewUrl && !imageError && (
				<div
					className='w-full h-full'
					style={{
						width: `${displayDimensions.width}px`,
						height: `${displayDimensions.height}px`,
					}}
				>
					<img
						src={previewUrl}
						alt={fileName}
						className={`
              w-full h-full object-cover transition-opacity duration-300
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              cursor-pointer hover:opacity-90
            `}
						onClick={download}
						onLoad={handleImageLoad}
						onError={handleImageError}
						loading='lazy'
						// Set explicit dimensions for better browser optimization
						width={displayDimensions.width}
						height={displayDimensions.height}
					/>
				</div>
			)}

			{/* Download Overlay */}
			{showImage && (
				<div className='absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer'>
					<button
						onClick={(e) => {
							e.stopPropagation();
							download();
						}}
						className='p-2 bg-black/70 hover:bg-black/80 text-white rounded-full transition-all transform hover:scale-110'
						aria-label={`Download ${fileName}`}
					>
						<svg
							className='w-5 h-5'
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
					</button>
				</div>
			)}
		</div>
	);
};
