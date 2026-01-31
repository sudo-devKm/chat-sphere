import { Avatar, Typography } from '@mui/material';
import type { UserResponse } from '@/types/auth.types';
import { formatLastSeen } from '@/utils/dateUtils';
import { StatusBadge } from './StatusBadge';
import { UserStatus } from './UserStatus';

interface UserInfoProps {
	user: UserResponse & { lastSeen?: string };
	isOnline: boolean;
}

export const UserInfo = ({ user, isOnline }: UserInfoProps) => {
	const lastSeenText = formatLastSeen(user.lastSeen);

	return (
		<div className='flex items-center gap-4'>
			<StatusBadge isOnline={isOnline}>
				<Avatar
					src={user.avatar}
					className='w-12 h-12 shadow-md ring-2 ring-white ring-offset-1'
					alt={user.username}
					sx={{
						background: isOnline
							? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
							: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
					}}
				>
					{user.username[0]?.toUpperCase()}
				</Avatar>
			</StatusBadge>

			<div className='space-y-0.5'>
				<Typography
					variant='h6'
					fontWeight={600}
					className='text-gray-800 tracking-tight'
				>
					{user.username}
				</Typography>
				<UserStatus isOnline={isOnline} lastSeenText={lastSeenText} />
			</div>
		</div>
	);
};
