import React from 'react';
import { Avatar } from '@mui/material';

interface CallAvatarProps {
	username: string;
	avatarUrl?: string;
	className?: string;
	size?: 'small' | 'medium' | 'large' | 'xlarge';
}

export const CallAvatar: React.FC<CallAvatarProps> = ({
	username,
	avatarUrl,
	className = '',
	size = 'large',
}) => {
	const sizeClasses = {
		small: 'w-12 h-12',
		medium: 'w-16 h-16',
		large: 'w-24 h-24',
		xlarge: 'w-32 h-32',
	};

	const textSizes = {
		small: 'text-lg',
		medium: 'text-xl',
		large: 'text-3xl',
		xlarge: 'text-4xl',
	};

	const getInitial = () => {
		return username[0]?.toUpperCase() || 'U';
	};

	return (
		<Avatar
			src={avatarUrl}
			className={`
				${sizeClasses[size]}
				${textSizes[size]}
				${className}
				border-4 border-white/30
				bg-gray-700
				shadow-lg
				font-bold
      	`}
		>
			{getInitial()}
		</Avatar>
	);
};
