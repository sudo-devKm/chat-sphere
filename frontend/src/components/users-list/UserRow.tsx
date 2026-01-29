import type { UserResponse } from '@/types/auth.types';
import {
	Avatar,
	ListItemButton,
	ListItemAvatar,
	ListItemText,
	Chip,
} from '@mui/material';
import { memo } from 'react';

function UserRow({
	user,
	onSelectUser,
	isOnline,
	userId,
}: {
	index: number;
	userId: string;
	user: UserResponse;
	onSelectUser: React.Dispatch<React.SetStateAction<string | null>>;
	selectedUserId: string | null;
	isOnline: boolean;
}) {
	return (
		<div>
			<ListItemButton
				className='hover:bg-gray-100 transition'
				onClick={() => onSelectUser(userId)}
			>
				<ListItemAvatar>
					<Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
				</ListItemAvatar>

				<ListItemText
					primary={user.username}
					secondary={isOnline ? 'Online' : 'Offline'}
				/>

				<Chip
					size='small'
					label={isOnline ? 'Online' : 'Offline'}
					color={isOnline ? 'success' : 'default'}
				/>
			</ListItemButton>
		</div>
	);
}

export default memo(UserRow);
