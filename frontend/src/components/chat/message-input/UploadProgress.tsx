import { LinearProgress, Box } from '@mui/material';

interface UploadProgressProps {
	progress: number;
}

export const UploadProgress = ({ progress }: UploadProgressProps) => {
	return (
		<div className='px-2'>
			<LinearProgress
				variant='determinate'
				value={progress}
				sx={{
					height: 6,
					borderRadius: 3,
					backgroundColor: 'rgb(243 244 246)',
					'& .MuiLinearProgress-bar': {
						borderRadius: 3,
						background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
					},
				}}
			/>
			<Box className='flex justify-between mt-1'>
				<span className='text-xs text-gray-500'>Uploading file...</span>
				<span className='text-xs font-medium text-gray-700'>{progress}%</span>
			</Box>
		</div>
	);
};
