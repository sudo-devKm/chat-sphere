import { useEffect, useRef } from 'react';

export const RemoteVideo = ({ stream }: { stream: MediaStream | null }) => {
	const videoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		if (!videoRef.current || !stream) return;
		videoRef.current.srcObject = stream;
	}, [stream]);

	if (!stream) return null;

	return (
		<div className='relative w-full max-w-full h-full max-h-full overflow-hidden'>
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted={false}
				className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto max-w-none'
				style={{ maxWidth: '100vw', maxHeight: '100vh' }}
			/>
		</div>
	);
};
