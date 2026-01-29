import { getChatWithUser } from '@/api/chat/chat.api';
import { useEffect, useState } from 'react';

export function useChatSession(userId: string) {
	const [chatId, setChatId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!userId) return;

		setLoading(true);

		getChatWithUser(userId)
			.then((res) => {
				setChatId(res.data.data.chatId);
			})
			.finally(() => setLoading(false));
	}, [userId]);

	return { chatId, loading };
}
