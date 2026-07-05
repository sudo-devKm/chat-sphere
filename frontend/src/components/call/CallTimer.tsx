// components/call/CallTimer.tsx
import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface CallTimerProps {
	startTime?: Date;
	className?: string;
	showIcon?: boolean;
}

export const CallTimer: React.FC<CallTimerProps> = ({
	startTime,
	className = '',
	showIcon = true,
}) => {
	const [duration, setDuration] = useState(0);

	useEffect(() => {
		if (!startTime) {
			return;
		}

		const updateDuration = () => {
			const seconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
			setDuration(seconds);
		};

		updateDuration();
		const interval = setInterval(updateDuration, 1000);

		return () => clearInterval(interval);
	}, [startTime]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			{showIcon && <AccessTimeIcon className='w-4 h-4 text-gray-400' />}
			<Typography variant='caption' className='font-mono text-gray-400'>
				{formatTime(startTime ? duration : 0)}
			</Typography>
		</div>
	);
};
