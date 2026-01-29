import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { BaseButton } from './BaseButton';

interface CameraButtonProps {
	isVideoOff: boolean;
	onToggle: () => void;
	size?: 'lg' | 'md' | 'sm';
}

export const CameraButton = ({
	isVideoOff,
	onToggle,
	size = 'md',
}: CameraButtonProps) => {
	return (
		<BaseButton
			onClick={onToggle}
			color='gray'
			size={size}
			label={isVideoOff ? 'Camera Off' : 'Camera'}
		>
			{isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
		</BaseButton>
	);
};
