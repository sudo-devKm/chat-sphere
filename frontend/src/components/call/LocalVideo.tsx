import { useEffect, useRef } from 'react';

interface LocalVideoProps {
	stream: MediaStream | null;
	className?: string;
	mirror?: boolean;
}

export const LocalVideo = ({
	stream,
	className = '',
	mirror = true,
}: LocalVideoProps) => {
	const videoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		if (!videoRef.current || !stream) return;

		videoRef.current.srcObject = stream;

		// Ensure video plays even if autoplay is blocked
		const playVideo = async () => {
			try {
				if (videoRef.current && videoRef.current.paused) {
					await videoRef.current.play();
				}
			} catch (error) {
				console.error('Error playing local video:', error);
			}
		};

		playVideo();
	}, [stream]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (videoRef.current) {
				videoRef.current.srcObject = null;
			}
		};
	}, []);

	if (!stream) return null;

	return (
		<div className={`relative ${className}`}>
			<video
				ref={videoRef}
				autoPlay
				muted={true}
				playsInline
				className={`
					w-full h-full
					object-cover
					rounded-xl
					border-2 border-white/30
					shadow-xl shadow-black/20
					${mirror ? 'transform -scale-x-100' : ''}
					bg-gray-900
				`}
			/>

			{/* Video quality indicator */}
			{stream.getVideoTracks().length > 0 &&
				stream.getVideoTracks()[0].enabled && (
					<div className='absolute bottom-2 right-2 z-10'>
						<div className='flex items-center gap-1 px-2 py-1 bg-black/50 rounded text-[10px] text-white'>
							<svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
								<path d='M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z' />
							</svg>
							<span>HD</span>
						</div>
					</div>
				)}

			{/* Fallback if video track is disabled */}
			{(!stream.getVideoTracks().length ||
				!stream.getVideoTracks()[0].enabled) && (
				<div className='absolute inset-0 flex items-center justify-center bg-gray-800 rounded-xl'>
					<div className='text-center'>
						<div className='w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-2'>
							<svg
								className='w-8 h-8 text-gray-400'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
									clipRule='evenodd'
								/>
							</svg>
						</div>
						<p className='text-sm text-gray-300'>Camera off</p>
					</div>
				</div>
			)}
		</div>
	);
};
