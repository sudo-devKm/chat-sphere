import { useState, useCallback, useEffect, useRef } from 'react';
import { SocketEvent } from '@/constants/socket.events';
import { useSocket } from '@/providers/SocketContext';
import { toastError } from '@/components/toaster/Toast';
import { useFileUpload } from '@/hooks/useFileUpload';
import { InputContainer } from './InputContainer';
import { UploadProgress } from './UploadProgress';
import { FilePreview } from './FilePreview';
import { InputArea } from './InputArea';

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

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setSelectedFile(file);
	};

	const handleRemoveFile = () => {
		setSelectedFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleSend = useCallback(async () => {
		const trimmed = message.trim();
		if (!trimmed && !selectedFile) return;
		if (uploading) return;

		try {
			let attachment;
			if (selectedFile) {
				attachment = await upload(selectedFile);
			}

			socket.emit(SocketEvent.CHAT_SEND, {
				receiverId: userId,
				content: trimmed,
				attachment,
			});

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

	const handleEmojiClick = (emoji: string) => {
		setMessage((prev) => prev + emoji);
		setShowEmoji(false);
	};

	return (
		<InputContainer>
			{uploading && <UploadProgress progress={progress} />}

			{selectedFile && (
				<FilePreview file={selectedFile} onRemove={handleRemoveFile} />
			)}

			<InputArea
				message={message}
				setMessage={setMessage}
				showEmoji={showEmoji}
				setShowEmoji={setShowEmoji}
				uploading={uploading}
				selectedFile={selectedFile}
				onSend={handleSend}
				onFileSelect={handleFileSelect}
				onEmojiClick={handleEmojiClick}
				emojiBtnRef={emojiBtnRef}
				fileInputRef={fileInputRef}
			/>
		</InputContainer>
	);
};
