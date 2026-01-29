import { useState, useCallback } from 'react';
import { uploadFile, type UploadedFile } from '@/api/file/file.api';
import { toastError } from '@/utils/toast';

type UseFileUploadOptions = {
	chatId: string;
};

export const useFileUpload = ({ chatId }: UseFileUploadOptions) => {
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState<number>(0);

	const upload = useCallback(
		async (file: File): Promise<UploadedFile> => {
			try {
				setUploading(true);
				setProgress(0);

				const uploaded = await uploadFile({
					chatId,
					file,
					onProgress: (p) => setProgress(p),
				});

				return uploaded;
			} catch (err) {
				toastError('File upload failed');
				throw err;
			} finally {
				setUploading(false);
			}
		},
		[chatId],
	);

	const reset = () => {
		setProgress(0);
		setUploading(false);
	};

	return {
		upload,
		uploading,
		progress,
		reset,
	};
};
