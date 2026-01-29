export interface FileTypeConfig {
	icon: string;
	bgColor: string;
	borderColor: string;
	textColor: string;
	iconColor: string;
	label: string;
}

export const FILE_TYPES: Record<string, FileTypeConfig> = {
	// Documents
	pdf: {
		icon: '📕',
		bgColor: 'bg-red-50',
		borderColor: 'border-red-200',
		textColor: 'text-red-600',
		iconColor: 'text-red-500',
		label: 'PDF Document',
	},
	doc: {
		icon: '📝',
		bgColor: 'bg-blue-50',
		borderColor: 'border-blue-200',
		textColor: 'text-blue-600',
		iconColor: 'text-blue-500',
		label: 'Word Document',
	},
	docx: {
		icon: '📝',
		bgColor: 'bg-blue-50',
		borderColor: 'border-blue-200',
		textColor: 'text-blue-600',
		iconColor: 'text-blue-500',
		label: 'Word Document',
	},
	txt: {
		icon: '📄',
		bgColor: 'bg-gray-50',
		borderColor: 'border-gray-200',
		textColor: 'text-gray-600',
		iconColor: 'text-gray-500',
		label: 'Text File',
	},
	// Spreadsheets
	xls: {
		icon: '📊',
		bgColor: 'bg-green-50',
		borderColor: 'border-green-200',
		textColor: 'text-green-600',
		iconColor: 'text-green-500',
		label: 'Excel Spreadsheet',
	},
	xlsx: {
		icon: '📊',
		bgColor: 'bg-green-50',
		borderColor: 'border-green-200',
		textColor: 'text-green-600',
		iconColor: 'text-green-500',
		label: 'Excel Spreadsheet',
	},
	csv: {
		icon: '📈',
		bgColor: 'bg-green-50',
		borderColor: 'border-green-200',
		textColor: 'text-green-600',
		iconColor: 'text-green-500',
		label: 'CSV File',
	},
	// Presentations
	ppt: {
		icon: '📽️',
		bgColor: 'bg-orange-50',
		borderColor: 'border-orange-200',
		textColor: 'text-orange-600',
		iconColor: 'text-orange-500',
		label: 'PowerPoint',
	},
	pptx: {
		icon: '📽️',
		bgColor: 'bg-orange-50',
		borderColor: 'border-orange-200',
		textColor: 'text-orange-600',
		iconColor: 'text-orange-500',
		label: 'PowerPoint',
	},
	// Archives
	zip: {
		icon: '🗜️',
		bgColor: 'bg-purple-50',
		borderColor: 'border-purple-200',
		textColor: 'text-purple-600',
		iconColor: 'text-purple-500',
		label: 'ZIP Archive',
	},
	rar: {
		icon: '🗜️',
		bgColor: 'bg-purple-50',
		borderColor: 'border-purple-200',
		textColor: 'text-purple-600',
		iconColor: 'text-purple-500',
		label: 'RAR Archive',
	},
	'7z': {
		icon: '🗜️',
		bgColor: 'bg-purple-50',
		borderColor: 'border-purple-200',
		textColor: 'text-purple-600',
		iconColor: 'text-purple-500',
		label: '7-Zip Archive',
	},
	// Media
	mp3: {
		icon: '🎵',
		bgColor: 'bg-pink-50',
		borderColor: 'border-pink-200',
		textColor: 'text-pink-600',
		iconColor: 'text-pink-500',
		label: 'Audio File',
	},
	mp4: {
		icon: '🎬',
		bgColor: 'bg-indigo-50',
		borderColor: 'border-indigo-200',
		textColor: 'text-indigo-600',
		iconColor: 'text-indigo-500',
		label: 'Video File',
	},
	// Images
	jpg: {
		icon: '🖼️',
		bgColor: 'bg-cyan-50',
		borderColor: 'border-cyan-200',
		textColor: 'text-cyan-600',
		iconColor: 'text-cyan-500',
		label: 'Image',
	},
	jpeg: {
		icon: '🖼️',
		bgColor: 'bg-cyan-50',
		borderColor: 'border-cyan-200',
		textColor: 'text-cyan-600',
		iconColor: 'text-cyan-500',
		label: 'Image',
	},
	png: {
		icon: '🖼️',
		bgColor: 'bg-cyan-50',
		borderColor: 'border-cyan-200',
		textColor: 'text-cyan-600',
		iconColor: 'text-cyan-500',
		label: 'Image',
	},
	// Default
	default: {
		icon: '📄',
		bgColor: 'bg-gray-50',
		borderColor: 'border-gray-200',
		textColor: 'text-gray-600',
		iconColor: 'text-gray-500',
		label: 'File',
	},
};

export const DEFAULT_FILE_CONFIG = FILE_TYPES.default;

export const getFileTypeConfig = (extension: string): FileTypeConfig => {
	return FILE_TYPES[extension.toLowerCase()] || DEFAULT_FILE_CONFIG;
};
