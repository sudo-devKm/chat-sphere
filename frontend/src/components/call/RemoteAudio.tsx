import { useEffect, useRef } from 'react';

export const RemoteAudio = ({ stream }: { stream: MediaStream | null }) => {
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (!audioRef.current || !stream) return;

		audioRef.current.srcObject = stream;
		audioRef.current.muted = false;
		audioRef.current.volume = 1;

		audioRef.current
			.play()
			.then(() => console.log('🔊 Audio playing'))
			.catch((e) => console.warn('🔇 Audio blocked', e));
	}, [stream]);

	if (!stream) return null;

	return <audio ref={audioRef} autoPlay playsInline />;
};
