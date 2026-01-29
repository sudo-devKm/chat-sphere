import CallEndIcon from '@mui/icons-material/CallEnd';
import { BaseButton } from './BaseButton';

interface RejectButtonProps {
	onClick: () => void;
	disabled?: boolean;
	size?: 'lg' | 'md' | 'sm';
}

export const RejectButton = ({
	onClick,
	disabled = false,
	size = 'md',
}: RejectButtonProps) => {
	return (
		<BaseButton
			onClick={onClick}
			disabled={disabled}
			color='red'
			size={size}
			label='Decline'
		>
			<CallEndIcon />
		</BaseButton>
	);
};
