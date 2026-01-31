import { Avatar, Typography, Badge, Box } from '@mui/material';
import type { UserResponse } from '@/types/auth.types';
import { Check } from 'lucide-react';

interface UserRowProps {
	index: number;
	userId: string;
	user: UserResponse;
	isOnline: boolean;
	onSelectUser: React.Dispatch<React.SetStateAction<string | null>>;
	selectedUserId: string | null;
}

export const UserRow = ({
	index,
	userId,
	user,
	isOnline,
	onSelectUser,
	selectedUserId,
}: UserRowProps) => {
	const isSelected = selectedUserId === userId;

	return (
		<div
			className={`
				px-6 py-4 cursor-pointer transition-all duration-300
				${
					isSelected
						? 'bg-linear-to-r from-blue-50 to-indigo-50 border-r-4 border-blue-500'
						: 'hover:bg-gray-50 active:bg-gray-100'
				}
				${index === 0 ? 'rounded-t-lg' : ''}
			`}
			onClick={() => onSelectUser(userId)}
		>
			<div className='flex items-center gap-4'>
				<AvatarWithStatus
					avatar={user.avatar}
					username={user.username}
					isOnline={isOnline}
				/>

				<div className='flex-1 min-w-0'>
					<UserInfo
						username={user.username}
						isOnline={isOnline}
						isSelected={isSelected}
					/>
					{isSelected && <SelectionIndicator />}
				</div>
			</div>
		</div>
	);
};

interface AvatarWithStatusProps {
	avatar?: string;
	username: string;
	isOnline: boolean;
}

const AvatarWithStatus = ({
	avatar,
	username,
	isOnline,
}: AvatarWithStatusProps) => {
	return (
		<Badge
			overlap='circular'
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			badgeContent={<StatusDot isOnline={isOnline} />}
		>
			<Avatar
				src={avatar}
				className='size-12 shadow-sm'
				alt={username}
				sx={{
					background: isOnline
						? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
						: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
				}}
			>
				{username[0]?.toUpperCase()}
			</Avatar>
		</Badge>
	);
};

interface StatusDotProps {
	isOnline: boolean;
}

const StatusDot = ({ isOnline }: StatusDotProps) => {
	return (
		<Box
			className={`size-3.5 rounded-full border-2 border-white ${
				isOnline
					? 'bg-linear-to-r from-green-400 to-emerald-500'
					: 'bg-linear-to-r from-gray-300 to-gray-400'
			} shadow-sm`}
		/>
	);
};

interface UserInfoProps {
	username: string;
	isOnline: boolean;
	isSelected: boolean;
}

const UserInfo = ({ username, isOnline, isSelected }: UserInfoProps) => {
	return (
		<>
			<div className='flex items-center justify-between'>
				<Typography
					variant='subtitle1'
					fontWeight={600}
					className={`truncate ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}
				>
					{username}
				</Typography>
				{isSelected && <Check className='size-5 text-blue-500' />}
			</div>
			<Typography
				variant='caption'
				className={`font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}
			>
				{isOnline ? 'Active now' : 'Offline'}
			</Typography>
		</>
	);
};

const SelectionIndicator = () => {
	return (
		<div className='absolute top-0 left-0 bottom-0 w-1 bg-linear-to-b from-blue-500 to-indigo-500 rounded-r-full' />
	);
};
