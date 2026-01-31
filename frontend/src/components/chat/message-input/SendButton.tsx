import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface SendButtonProps {
	isDisabled: boolean;
	onClick: () => void;
}

export const SendButton = ({ isDisabled, onClick }: SendButtonProps) => {
	return (
		<IconButton
			size='medium'
			color='primary'
			disabled={isDisabled}
			onClick={onClick}
			className={`
				text-white shadow-lg
				${
					isDisabled
						? 'bg-gray-200 text-gray-400'
						: 'bg-linear-to-br from-blue-600 to-indigo-600'
				}
			`}
			sx={{
				borderRadius: '14px',
				padding: '12px',
				'&:hover': !isDisabled
					? {
							background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
							transform: 'translateY(-2px)',
							boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
						}
					: {},
				'&:active': !isDisabled
					? {
							transform: 'translateY(0)',
						}
					: {},
				transition: 'all 0.2s ease',
			}}
		>
			<SendIcon className='size-5' />
		</IconButton>
	);
};
