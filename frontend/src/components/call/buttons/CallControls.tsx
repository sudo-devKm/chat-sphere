import { CallButtonGroup } from './CallButtonGroup';
import { CameraButton } from './CameraButton';
import { EndCallButton } from './EndCallButton';
import { MuteButton } from './MuteButton';
import { SpeakerButton } from './SpeakerButton';

interface CallControlsProps {
	onEnd: () => void;
	onToggleAudio: () => void;
	onToggleVideo?: () => void;
	onToggleSpeaker?: () => void;
	isAudioMuted: boolean;
	isVideoOff: boolean;
	isSpeakerOff?: boolean;
	callType: 'audio' | 'video';
	className?: string;
}

export const CallControls = ({
	onEnd,
	onToggleAudio,
	onToggleVideo,
	onToggleSpeaker,
	isAudioMuted,
	isVideoOff,
	isSpeakerOff = false,
	callType,
	className = '',
}: CallControlsProps) => {
	return (
		<CallButtonGroup className={className}>
			<MuteButton isMuted={isAudioMuted} onToggle={onToggleAudio} size='md' />

			{onToggleSpeaker && (
				<SpeakerButton
					isSpeakerOff={isSpeakerOff}
					onToggle={onToggleSpeaker}
					size='md'
				/>
			)}

			{callType === 'video' && onToggleVideo && (
				<CameraButton
					isVideoOff={isVideoOff}
					onToggle={onToggleVideo}
					size='md'
				/>
			)}

			<EndCallButton onEnd={onEnd} size='md' />
		</CallButtonGroup>
	);
};
