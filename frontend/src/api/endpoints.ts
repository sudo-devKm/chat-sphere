export const API_ENDPOINTS = {
	AUTH: {
		LOGIN: '/auth/login',
		REGISTER: '/auth/register',
		ME: '/auth/me',
		LOGOUT: '/auth/logout',
	},
	USERS: {
		GET_USERS: '/users',
	},
	COMMON: {
		FILE_PRESIGNED_UPLOAD: '/files/presigned-upload',
		FILE_PRESIGNED_DOWNLOAD: '/files/presigned-download',
	},
	CHAT: {
		GET_MESSAGES: (userId: string) => `/chat/${userId}/messages`,
	},
};
