import CallEndIcon from '@mui/icons-material/CallEnd';
import { BaseButton } from './BaseButton';

interface EndCallButtonProps {
	onEnd: () => void;
	size?: 'lg' | 'md' | 'sm';
}

export const EndCallButton = ({ onEnd, size = 'md' }: EndCallButtonProps) => {
	return (
		<BaseButton onClick={onEnd} color='red' size={size} label='End Call'>
			<CallEndIcon />
		</BaseButton>
	);
};
