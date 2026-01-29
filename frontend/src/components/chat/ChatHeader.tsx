import { Avatar, Typography, Badge, IconButton, Tooltip } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';
import CircleIcon from '@mui/icons-material/Circle';
import type { UserResponse } from '@/types/auth.types';

interface ChatHeaderProps {
	user: UserResponse;
	isOnline: boolean;
	onAudioCall: () => void;
	onVideoCall: () => void;
	disableCalls?: boolean;
}

export const ChatHeader = ({
	user,
	isOnline,
	onAudioCall,
	onVideoCall,
	disableCalls = false,
}: ChatHeaderProps) => {
	return (
		<div className='flex items-center justify-between px-4 py-3 border-b bg-white'>
			{/* User Info */}
			<div className='flex items-center gap-3'>
				<Badge
					overlap='circular'
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					badgeContent={
						<CircleIcon
							className={`w-3 h-3 ${
								isOnline ? 'text-green-500' : 'text-gray-400'
							}`}
						/>
					}
				>
					<Avatar src={user.avatar} className='w-10 h-10' alt={user.username}>
						{user.username[0]?.toUpperCase()}
					</Avatar>
				</Badge>

				<div>
					<Typography variant='subtitle1' fontWeight={600}>
						{user.username}
					</Typography>
					<Typography
						variant='caption'
						className={isOnline ? 'text-green-600' : 'text-gray-500'}
					>
						{isOnline ? 'Online' : 'Offline'}
					</Typography>
				</div>
			</div>

			{/* Call Buttons */}
			<div className='flex items-center gap-2'>
				<Tooltip
					title={
						disableCalls
							? 'Another call is active'
							: !isOnline
								? 'User is offline'
								: 'Audio call'
					}
				>
					<span>
						{' '}
						{/* Wrap IconButton in span for disabled tooltip */}
						<IconButton
							onClick={onAudioCall}
							disabled={disableCalls || !isOnline}
							className={`
								${
									disableCalls || !isOnline
										? 'bg-gray-100 text-gray-400'
										: 'bg-green-100 text-green-600 hover:bg-green-200'
								}
								transition-colors
							`}
							size='small'
						>
							<PhoneIcon fontSize='small' />
						</IconButton>
					</span>
				</Tooltip>

				<Tooltip
					title={
						disableCalls
							? 'Another call is active'
							: !isOnline
								? 'User is offline'
								: 'Video call'
					}
				>
					<span>
						<IconButton
							onClick={onVideoCall}
							disabled={disableCalls || !isOnline}
							className={`
								${
									disableCalls || !isOnline
										? 'bg-gray-100 text-gray-400'
										: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
								}
								transition-colors
							`}
							size='small'
						>
							<VideocamIcon fontSize='small' />
						</IconButton>
					</span>
				</Tooltip>
			</div>
		</div>
	);
};
