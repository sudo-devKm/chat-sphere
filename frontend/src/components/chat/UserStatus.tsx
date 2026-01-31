import { Typography, Box } from '@mui/material';

interface UserStatusProps {
	isOnline: boolean;
	lastSeenText: string;
}

export const UserStatus = ({ isOnline, lastSeenText }: UserStatusProps) => {
	return (
		<div className='flex items-center gap-2'>
			<Box
				className={`w-2 h-2 rounded-full animate-pulse ${
					isOnline ? 'bg-green-500' : 'bg-gray-400'
				}`}
			/>
			<Typography
				variant='caption'
				className={`font-medium tracking-wide ${
					isOnline ? 'text-green-600' : 'text-gray-500'
				}`}
			>
				{isOnline ? 'Active now' : `Last seen ${lastSeenText}`}
			</Typography>
		</div>
	);
};
