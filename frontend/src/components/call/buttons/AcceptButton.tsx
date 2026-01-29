import { CircularProgress } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import { BaseButton } from './BaseButton';

interface AcceptButtonProps {
	callType: 'audio' | 'video';
	accepting?: boolean;
	onClick: () => void;
	size?: 'lg' | 'md' | 'sm';
}

export const AcceptButton = ({
	callType,
	accepting = false,
	onClick,
	size = 'md',
}: AcceptButtonProps) => {
	const isVideo = callType === 'video';
	const color = isVideo ? 'blue' : 'green';
	const Icon = isVideo ? VideocamIcon : CallIcon;
	const label = accepting ? 'Connecting' : isVideo ? 'Video' : 'Audio';

	return (
		<BaseButton
			onClick={onClick}
			disabled={accepting}
			color={color}
			size={size}
			label={label}
		>
			{accepting ? (
				<CircularProgress
					size={size === 'lg' ? 24 : 20}
					className='text-white'
				/>
			) : (
				<Icon />
			)}
		</BaseButton>
	);
};
