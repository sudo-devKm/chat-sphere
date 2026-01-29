export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 Bytes';

	const units = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

export const getFileExtension = (fileName: string): string => {
	const ext = fileName.split('.').pop()?.toLowerCase() || '';
	return ext ? `.${ext}` : '';
};

export const truncateFileName = (
	fileName: string,
	maxLength: number = 30,
): string => {
	if (fileName.length <= maxLength) return fileName;

	const extension = getFileExtension(fileName);
	const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf('.'));

	if (nameWithoutExt.length <= maxLength - extension.length) {
		return fileName;
	}

	const truncatedName =
		nameWithoutExt.slice(0, maxLength - extension.length - 3) + '...';
	return truncatedName + extension;
};
