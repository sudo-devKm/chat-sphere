import { useState } from 'react';
import { CallModal } from '@/components/call/CallModal';
import type { CallSession } from '@/types/call.types';

export const CallInterface = () => {
	const [callSession, setCallSession] = useState<CallSession | null>(null);
	const [callStartTime, setCallStartTime] = useState<Date>();

	const handleAcceptCall = async () => {
		setCallStartTime(new Date());
		setCallSession((prev) =>
			prev
				? {
						...prev,
						state: 'connected',
					}
				: null,
		);
	};

	const handleEndCall = () => {
		setCallSession(null);
		setCallStartTime(undefined);
	};

	const handleToggleAudio = () => {
		setCallSession((prev) =>
			prev
				? {
						...prev,
						isAudioMuted: !prev.isAudioMuted,
					}
				: null,
		);
	};

	const handleToggleVideo = () => {
		setCallSession((prev) =>
			prev
				? {
						...prev,
						isVideoOff: !prev.isVideoOff,
					}
				: null,
		);
	};

	if (!callSession) return null;

	return (
		<CallModal
			open={true}
			callDirection={callSession.direction}
			callType={callSession.type}
			callState={callSession.state}
			localStream={callSession.localStream || null}
			remoteStream={callSession.remoteStream || null}
			peerName={callSession.peerInfo.peerName}
			peerAvatar={callSession.peerInfo.avatar}
			peerStatus={callSession.peerInfo.status}
			onAccept={
				callSession.direction === 'incoming' ? handleAcceptCall : undefined
			}
			onEnd={handleEndCall}
			onReject={
				callSession.direction === 'incoming' ? handleEndCall : undefined
			}
			toggleAudio={handleToggleAudio}
			toggleVideo={callSession.type === 'video' ? handleToggleVideo : undefined}
			isAudioMuted={callSession.isAudioMuted}
			isVideoOff={callSession.isVideoOff}
			callStartTime={callStartTime}
			timeoutDuration={60}
		/>
	);
};
