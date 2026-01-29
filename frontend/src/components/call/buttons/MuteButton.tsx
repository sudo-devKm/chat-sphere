import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { BaseButton } from './BaseButton';

interface MuteButtonProps {
	isMuted: boolean;
	onToggle: () => void;
	size?: 'lg' | 'md' | 'sm';
}

export const MuteButton = ({
	isMuted,
	onToggle,
	size = 'md',
}: MuteButtonProps) => {
	return (
		<BaseButton
			onClick={onToggle}
			color='gray'
			size={size}
			label={isMuted ? 'Muted' : 'Mic'}
		>
			{isMuted ? <MicOffIcon /> : <MicIcon />}
		</BaseButton>
	);
};
