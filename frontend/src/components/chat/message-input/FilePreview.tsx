import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface FilePreviewProps {
	file: File;
	onRemove: () => void;
}

export const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
	const isImage = file.type.startsWith('image/');
	const fileSize = (file.size / 1024).toFixed(1);

	return (
		<div className='flex items-center justify-between bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-3 border border-blue-100 shadow-sm'>
			<div className='flex items-center gap-3'>
				<div className='p-2 rounded-lg bg-white shadow-sm border border-blue-100'>
					{isImage ? (
						<ImageIcon className='text-blue-600 size-5' />
					) : (
						<InsertDriveFileIcon className='text-blue-600 size-5' />
					)}
				</div>
				<div className='flex flex-col min-w-0'>
					<span className='text-sm font-medium text-gray-800 truncate max-w-60'>
						{file.name}
					</span>
					<span className='text-xs text-gray-500'>{fileSize} KB</span>
				</div>
			</div>
			<IconButton
				size='small'
				onClick={onRemove}
				className='text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors'
				sx={{
					'&:hover': {
						backgroundColor: 'rgb(254 226 226)',
					},
				}}
			>
				<CloseIcon fontSize='small' />
			</IconButton>
		</div>
	);
};
