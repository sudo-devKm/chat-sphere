import { getChatWithUser } from '@/api/chat/chat.api';
import { useEffect, useState } from 'react';

export function useChatSession(userId: string) {
	const [chatId, setChatId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	// Flip into the loading state as soon as userId changes, during render
	// rather than inside the effect below.
	const [prevUserId, setPrevUserId] = useState(userId);
	if (userId !== prevUserId) {
		setPrevUserId(userId);
		if (userId) setLoading(true);
	}

	useEffect(() => {
		if (!userId) return;

		getChatWithUser(userId)
			.then((res) => {
				setChatId(res.data.data.chatId);
			})
			.finally(() => setLoading(false));
	}, [userId]);

	return { chatId, loading };
}
