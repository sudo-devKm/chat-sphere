import { IconButton, TextField, Popover, LinearProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import { useState, useCallback, useEffect, useRef } from 'react';
import EmojiPicker, {
	EmojiStyle,
	type EmojiClickData,
} from 'emoji-picker-react';
import { SocketEvent } from '@/constants/socket.events';
import { useSocket } from '@/providers/SocketProvider';
import { toastError } from '@/utils/toast';
import { useFileUpload } from '@/hooks/useFileUpload';

interface Props {
	userId: string;
	chatId: string;
}

export const MessageInput: React.FC<Props> = ({ userId, chatId }) => {
	const socket = useSocket();

	const [message, setMessage] = useState('');
	const [showEmoji, setShowEmoji] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const emojiBtnRef = useRef<HTMLButtonElement | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const { upload, uploading, progress } = useFileUpload({ chatId });

	const onEmojiClick = (emoji: EmojiClickData) => {
		setMessage((prev) => prev + emoji.emoji);
		setShowEmoji(false);
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setSelectedFile(file);
	};

	const handleSend = useCallback(async () => {
		const trimmed = message.trim();

		// nothing to send
		if (!trimmed && !selectedFile) return;
		if (uploading) return;

		try {
			let attachment;

			// 1. Upload file IF selected
			if (selectedFile) {
				attachment = await upload(selectedFile);
			}

			// 2. Emit message AFTER upload
			socket.emit(SocketEvent.CHAT_SEND, {
				receiverId: userId,
				content: trimmed,
				attachment,
			});

			// 3. Reset UI
			setMessage('');
			setSelectedFile(null);
			if (fileInputRef.current) fileInputRef.current.value = '';
		} catch {
			toastError('Failed to send message');
		}
	}, [message, selectedFile, upload, uploading, socket, userId]);

	useEffect(() => {
		socket.on(SocketEvent.CHAT_ERROR, () => {
			toastError('Message send failed');
		});

		return () => {
			socket.off(SocketEvent.CHAT_ERROR);
		};
	}, [socket]);

	return (
		<div className='shrink-0 border-t bg-gray-50 px-4 py-3'>
			<div className='flex flex-col gap-1 rounded-2xl bg-white px-3 py-2 shadow-sm'>
				{uploading && <LinearProgress variant='determinate' value={progress} />}

				<div className='flex items-center gap-2'>
					<IconButton
						size='small'
						onClick={() => fileInputRef.current?.click()}
					>
						<AttachFileIcon fontSize='small' />
					</IconButton>

					<input
						type='file'
						ref={fileInputRef}
						hidden
						onChange={handleFileSelect}
					/>

					<IconButton
						size='small'
						ref={emojiBtnRef}
						onClick={() => setShowEmoji((v) => !v)}
					>
						<EmojiEmotionsOutlinedIcon fontSize='small' />
					</IconButton>

					<Popover
						open={showEmoji}
						anchorEl={emojiBtnRef.current}
						onClose={() => setShowEmoji(false)}
						anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
					>
						<EmojiPicker
							onEmojiClick={onEmojiClick}
							emojiStyle={EmojiStyle.NATIVE}
							lazyLoadEmojis
							previewConfig={{ showPreview: false }}
						/>
					</Popover>

					<TextField
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder='Type a message'
						variant='standard'
						fullWidth
						multiline
						maxRows={4}
						slotProps={{
							input: {
								disableUnderline: true,
								className: 'text-sm',
							},
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								handleSend();
							}
						}}
					/>

					<IconButton
						color='primary'
						disabled={uploading || (!message.trim() && !selectedFile)}
						onClick={handleSend}
					>
						<SendIcon />
					</IconButton>
				</div>

				{selectedFile && (
					<div className='text-xs text-gray-600 pl-2'>
						📎 {selectedFile.name}
					</div>
				)}
			</div>
		</div>
	);
};
