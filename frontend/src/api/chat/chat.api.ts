import { http } from '../http';

export interface ChatMessage {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
}

export interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
}

export interface GetMessagesResponse {
	messages: ChatMessage[];
	pagination: Pagination;
}

export const getMessages = async (params: {
	chatId: string;
	page: number;
	limit: number;
}) => {
	return http.get<{ data: GetMessagesResponse }>('/chats/messages', {
		params,
	});
};

export const getChatWithUser = async (userId: string) => {
	return http.get(`/chats/with-user/${userId}`);
};
