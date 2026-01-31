import { IconButton, Tooltip } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';

interface CallButtonsProps {
	isOnline: boolean;
	disableCalls: boolean;
	onAudioCall: () => void;
	onVideoCall: () => void;
}

export const CallButtons = ({
	isOnline,
	disableCalls,
	onAudioCall,
	onVideoCall,
}: CallButtonsProps) => {
	const isCallDisabled = disableCalls || !isOnline;
	const tooltipText = getCallTooltipText(disableCalls, isOnline);

	return (
		<div className='flex items-center gap-3'>
			<CallButton
				type='audio'
				tooltipText={tooltipText}
				disabled={isCallDisabled}
				onClick={onAudioCall}
			/>
			<CallButton
				type='video'
				tooltipText={tooltipText}
				disabled={isCallDisabled}
				onClick={onVideoCall}
			/>
		</div>
	);
};

// Helper function for tooltip text
const getCallTooltipText = (disableCalls: boolean, isOnline: boolean) => {
	if (disableCalls) return 'Another call is active';
	if (!isOnline) return 'User is offline';
	return null;
};

interface CallButtonProps {
	type: 'audio' | 'video';
	tooltipText: string | null;
	disabled: boolean;
	onClick: () => void;
}

const CallButton = ({
	type,
	tooltipText,
	disabled,
	onClick,
}: CallButtonProps) => {
	const isAudio = type === 'audio';
	const icon = isAudio ? (
		<PhoneIcon className='text-lg' />
	) : (
		<VideocamIcon className='text-lg' />
	);
	const title = tooltipText || (isAudio ? 'Audio call' : 'Video call');

	const getButtonClasses = () => {
		const baseClasses = `
			relative transition-all duration-300 transform hover:scale-105 active:scale-95
			shadow-sm rounded-xl p-2.5
		`;

		if (disabled) {
			return `${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed`;
		}

		if (isAudio) {
			return `${baseClasses} bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:from-green-100 hover:to-emerald-100 hover:shadow-md`;
		}

		return `${baseClasses} bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:from-blue-100 hover:to-indigo-100 hover:shadow-md`;
	};

	return (
		<Tooltip
			title={title}
			arrow
			slotProps={{
				tooltip: {
					sx: {
						bgcolor: 'background.paper',
						color: 'text.primary',
						boxShadow: 2,
						border: '1px solid',
						borderColor: 'divider',
						fontSize: '0.75rem',
					},
				},
				arrow: { sx: { color: 'divider' } },
			}}
		>
			<span>
				<IconButton
					onClick={onClick}
					disabled={disabled}
					className={getButtonClasses()}
					size='medium'
				>
					{icon}
				</IconButton>
			</span>
		</Tooltip>
	);
};
