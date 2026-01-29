import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { BaseButton } from './BaseButton';

interface SpeakerButtonProps {
	isSpeakerOff: boolean;
	onToggle: () => void;
	size?: 'lg' | 'md' | 'sm';
}

export const SpeakerButton = ({
	isSpeakerOff,
	onToggle,
	size = 'md',
}: SpeakerButtonProps) => {
	return (
		<BaseButton
			onClick={onToggle}
			color='gray'
			size={size}
			label={isSpeakerOff ? 'Speaker Off' : 'Speaker'}
		>
			{isSpeakerOff ? <VolumeOffIcon /> : <VolumeUpIcon />}
		</BaseButton>
	);
};
