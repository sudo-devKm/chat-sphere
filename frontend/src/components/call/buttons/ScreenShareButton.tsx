import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import { BaseCallButton } from './BaseCallButton';

interface ScreenShareButtonProps {
	isScreenSharing: boolean;
	onToggle: () => void;
}

export const ScreenShareButton = ({
	isScreenSharing,
	onToggle,
}: ScreenShareButtonProps) => {
	return (
		<BaseCallButton
			onClick={onToggle}
			color='gray'
			size='medium'
			label={isScreenSharing ? 'Sharing' : 'Share'}
			isActive={isScreenSharing}
		>
			{isScreenSharing ? (
				<StopScreenShareIcon className='w-7 h-7' />
			) : (
				<ScreenShareIcon className='w-7 h-7' />
			)}
		</BaseCallButton>
	);
};
