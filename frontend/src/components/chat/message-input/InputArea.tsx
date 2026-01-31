import { TextField, IconButton, Box } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import { EmojiPickerPopover } from './EmojiPickerPopover';
import { SendButton } from './SendButton';

interface InputAreaProps {
	message: string;
	setMessage: (message: string) => void;
	showEmoji: boolean;
	setShowEmoji: (show: boolean) => void;
	uploading: boolean;
	selectedFile: File | null;
	onSend: () => void;
	onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onEmojiClick: (emoji: string) => void;
	emojiBtnRef: React.RefObject<HTMLButtonElement | null>;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const InputArea = ({
	message,
	setMessage,
	showEmoji,
	setShowEmoji,
	uploading,
	selectedFile,
	onSend,
	onFileSelect,
	onEmojiClick,
	emojiBtnRef,
	fileInputRef,
}: InputAreaProps) => {
	const isSendDisabled = uploading || (!message.trim() && !selectedFile);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onSend();
		}
	};

	return (
		<div className='flex items-end gap-3'>
			{/* Attachment Button */}
			<IconButton
				size='medium'
				onClick={() => fileInputRef.current?.click()}
				className='bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm'
				sx={{
					borderRadius: '12px',
					'&:hover': {
						backgroundColor: 'rgb(249 250 251)',
						transform: 'scale(1.05)',
					},
					transition: 'all 0.2s ease',
				}}
			>
				<AttachFileIcon className='size-5' />
			</IconButton>

			<input type='file' ref={fileInputRef} hidden onChange={onFileSelect} />

			{/* Emoji Button */}
			<IconButton
				size='medium'
				ref={emojiBtnRef}
				onClick={() => setShowEmoji(!showEmoji)}
				className='bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm'
				sx={{
					borderRadius: '12px',
					'&:hover': {
						backgroundColor: 'rgb(249 250 251)',
						transform: 'scale(1.05)',
					},
					transition: 'all 0.2s ease',
				}}
			>
				<EmojiEmotionsOutlinedIcon className='size-5' />
			</IconButton>

			<EmojiPickerPopover
				open={showEmoji}
				anchorEl={emojiBtnRef.current}
				onClose={() => setShowEmoji(false)}
				onEmojiClick={onEmojiClick}
			/>

			{/* Text Input */}
			<Box className='flex-1'>
				<TextField
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder='Type a message...'
					variant='outlined'
					fullWidth
					multiline
					maxRows={4}
					minRows={1}
					disabled={uploading}
					onKeyDown={handleKeyDown}
					sx={{
						'& .MuiOutlinedInput-root': {
							backgroundColor: 'white',
							borderRadius: '14px',
							borderColor: 'rgb(229 231 235)',
							'&:hover': {
								borderColor: 'rgb(209 213 219)',
							},
							'&.Mui-focused': {
								borderColor: 'rgb(59 130 246)',
								boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
							},
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: 'transparent',
							},
							'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
								borderColor: 'rgb(59 130 246)',
								borderWidth: '2px',
							},
						},
						'& .MuiOutlinedInput-input': {
							padding: '12px 16px',
							fontSize: '0.9375rem',
							'&::placeholder': {
								color: 'rgb(156 163 175)',
							},
						},
					}}
				/>
			</Box>

			{/* Send Button */}
			<SendButton isDisabled={isSendDisabled} onClick={onSend} />
		</div>
	);
};
