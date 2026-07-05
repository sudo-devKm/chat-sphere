import { useCallback, useState, useEffect } from 'react';
import { SocketEvent } from '@/constants/socket.events';
import { useSocket } from '@/providers/SocketContext';
import { toastError } from '@/components/toaster/Toast';
import { useFileUpload } from '@/hooks/useFileUpload';

interface UseMessageInputProps {
	userId: string;
	chatId: string;
}

export const useMessageInput = ({ userId, chatId }: UseMessageInputProps) => {
	const socket = useSocket();
	const [message, setMessage] = useState('');
	const [showEmoji, setShowEmoji] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const { upload, uploading, progress } = useFileUpload({ chatId });

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
			return true;
		} catch {
			toastError('Failed to send message');
			return false;
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

	const handleFileSelect = (file: File) => {
		setSelectedFile(file);
	};

	const handleRemoveFile = () => {
		setSelectedFile(null);
	};

	const handleEmojiClick = (emoji: string) => {
		setMessage((prev) => prev + emoji);
		setShowEmoji(false);
	};

	return {
		message,
		setMessage,
		showEmoji,
		setShowEmoji,
		selectedFile,
		setSelectedFile,
		uploading,
		progress,
		handleSend,
		handleFileSelect,
		handleRemoveFile,
		handleEmojiClick,
	};
};
