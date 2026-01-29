import { useEffect, useRef } from 'react';

export const RemoteVideo = ({ stream }: { stream: MediaStream | null }) => {
	const videoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		if (!videoRef.current || !stream) return;

		videoRef.current.srcObject = stream;
	}, [stream]);

	if (!stream) return null;

	return (
		<video
			autoPlay
			playsInline
			muted={false}
			ref={videoRef}
			className='w-full h-full object-cover'
		/>
	);
};
