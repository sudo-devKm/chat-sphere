import { Box } from '@mui/material';

interface StatusIndicatorProps {
	isOnline: boolean;
}

export const StatusIndicator = ({ isOnline }: StatusIndicatorProps) => {
	return (
		<Box
			className={`w-3.5 h-3.5 rounded-full border-2 border-white ${
				isOnline
					? 'bg-linear-to-r from-green-400 to-emerald-500'
					: 'bg-linear-to-r from-gray-300 to-gray-400'
			} shadow-sm`}
		/>
	);
};
