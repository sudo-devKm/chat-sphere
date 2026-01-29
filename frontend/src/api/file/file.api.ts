import { API_ENDPOINTS } from '../endpoints';
import { http } from '../http';

export type UploadedFile = {
	key: string;
	fileUrl: string;
	fileName: string;
	fileType: 'image' | 'file';
	mimeType: string;
	size: number;
	dimensions?: {
		width: number;
		height: number;
	} | null;
};

// Extract image dimensions from file
const extractImageDimensions = (
	file: File,
): Promise<{ width: number; height: number } | null> => {
	return new Promise((resolve) => {
		if (!file.type.startsWith('image/')) {
			resolve(null);
			return;
		}

		const img = new Image();
		const url = URL.createObjectURL(file);

		img.onload = () => {
			resolve({
				width: img.naturalWidth,
				height: img.naturalHeight,
			});
			URL.revokeObjectURL(url); // Clean up
		};

		img.onerror = () => {
			resolve(null);
			URL.revokeObjectURL(url);
		};

		img.src = url;
	});
};

export const getDownloadUrl = async (
	chatId: string,
	key: string,
	options?: { signal?: AbortSignal },
): Promise<string> => {
	const res = await http.get(API_ENDPOINTS.COMMON.FILE_PRESIGNED_DOWNLOAD, {
		params: { chatId, key },
		signal: options?.signal,
	});

	if (!res.data?.success) {
		throw new Error('Failed to get download url');
	}

	return res.data.data.downloadUrl;
};

const getPresignedUploadUrl = async (params: {
	chatId: string;
	file: File;
}) => {
	const { chatId, file } = params;

	const response = await http.post(API_ENDPOINTS.COMMON.FILE_PRESIGNED_UPLOAD, {
		chatId,
		fileName: file.name,
		fileType: file.type,
		fileSize: file.size,
	});

	if (!response.data?.success) {
		throw new Error(
			response.data?.message || 'Failed to get presigned upload URL',
		);
	}

	return response.data.data as {
		uploadUrl: string;
		fileUrl: string;
		key: string;
		fileName: string;
		fileType: string;
	};
};

export const uploadFile = async (params: {
	chatId: string;
	file: File;
	onProgress?: (percent: number) => void;
}): Promise<UploadedFile> => {
	const { chatId, file, onProgress } = params;

	// Extract dimensions before upload (for immediate use)
	const dimensions = await extractImageDimensions(file);

	// Get presigned URL
	const presigned = await getPresignedUploadUrl({ chatId, file });

	// Upload to S3
	await http.put(presigned.uploadUrl, file, {
		headers: {
			'Content-Type': file.type,
		},
		onUploadProgress: (event) => {
			if (!event.total || !onProgress) return;
			const percent = Math.round((event.loaded * 100) / event.total);
			onProgress(percent);
		},
	});

	// Return file metadata with dimensions
	return {
		key: presigned.key,
		fileUrl: presigned.fileUrl,
		fileName: file.name,
		fileType: file.type.startsWith('image') ? 'image' : 'file',
		mimeType: file.type,
		size: file.size,
		dimensions, // Include extracted dimensions
	};
};
