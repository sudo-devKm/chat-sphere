import { Badge } from '@mui/material';
import type { ReactNode } from 'react';
import { StatusIndicator } from './StatusIndicator';

interface StatusBadgeProps {
	isOnline: boolean;
	children: ReactNode;
}

export const StatusBadge = ({ isOnline, children }: StatusBadgeProps) => {
	return (
		<Badge
			overlap='circular'
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			badgeContent={<StatusIndicator isOnline={isOnline} />}
		>
			{children}
		</Badge>
	);
};
