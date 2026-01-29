import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { BaseCallButton } from './BaseCallButton';

interface VideoButtonProps {
	isVideoOff: boolean;
	onToggle: () => void;
}

export const VideoButton = ({ isVideoOff, onToggle }: VideoButtonProps) => {
	return (
		<BaseCallButton
			onClick={onToggle}
			color='gray'
			size='medium'
			label={isVideoOff ? 'Camera Off' : 'Camera'}
			isActive={isVideoOff}
		>
			{isVideoOff ? (
				<VideocamOffIcon className='w-7 h-7' />
			) : (
				<VideocamIcon className='w-7 h-7' />
			)}
		</BaseCallButton>
	);
};
